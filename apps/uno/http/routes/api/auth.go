package api

import (
	"errors"
	"net/http"
	"net/url"
	"strings"
	"uno/config"
	"uno/domain/port"
	"uno/domain/rule"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
	"uno/pkg/randid"
)

const (
	authErrUnknown      = "unknown"
	authErrNotAllowed   = "not_allowed"
	authErrExpiredToken = "expired_token"
	authErrInvalidToken = "invalid_token"
	authErrUserNotFound = "user_not_found"
)

type auth struct {
	logger      port.Logger
	config      *config.Config
	authService *service.AuthService
	userService *service.UserService
}

func NewAuthMux(
	logger port.Logger,
	config *config.Config,
	authService *service.AuthService,
	userService *service.UserService,
	sessionMiddleware handler.Middleware,
	admin handler.Middleware,
) *router.Mux {
	mux := router.NewMux()

	h := &auth{
		logger:      logger,
		config:      config,
		authService: authService,
		userService: userService,
	}

	mux.GET("/me", h.getCurrentUser, sessionMiddleware)
	mux.POST("/sign-out", h.signOut, sessionMiddleware)
	mux.GET("/magic-link/verify", h.verifyMagicLink)

	// Provider routes
	mux.GET("/feide", h.loginWithFeide)
	mux.GET("/callback/feide", h.handleFeideCallback)

	// Sign-in attempt lookup
	mux.GET("/sign-in-attempt/{id}", h.getSignInAttempt)

	mux.GET("/sessions/{id}", h.getSessionByID, admin)

	return mux
}

// loginWithFeide redirects the user to the Feide login page
// @Summary      Login with Feide
// @Tags         auth
// @Success      302  {string}  string  "Redirect to Feide"
// @Failure      500  {string}  string  "Internal Server Error"
// @Router       /auth/feide [get]
func (h *auth) loginWithFeide(ctx *handler.Context) error {
	state, err := randid.Generate(32)
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to generate state", "error", err)
		return ctx.InternalServerError()
	}

	authURL, err := h.authService.CreateFeideAuthorizationURL(state)
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to create Feide auth URL", "error", err)
		return ctx.InternalServerError()
	}

	ctx.SetCookie(&http.Cookie{
		Name:     "feide_oauth_state",
		Value:    state,
		Path:     "/",
		MaxAge:   600,
		HttpOnly: true,
		Secure:   ctx.R.TLS != nil,
		SameSite: http.SameSiteLaxMode,
	})

	site, ok := ctx.QueryParam("site")
	if ok && site != "" {
		ctx.SetCookie(&http.Cookie{
			Name:     "site_redirect",
			Value:    site,
			Path:     "/",
			MaxAge:   600,
			HttpOnly: true,
			Secure:   ctx.R.TLS != nil,
			SameSite: http.SameSiteLaxMode,
		})
	}

	return ctx.Redirect(authURL)
}

// handleFeideCallback handles the Feide OAuth callback
// @Summary      Feide callback
// @Tags         auth
// @Param        code   query  string  true  "Authorization code"
// @Param        state  query  string  true  "OAuth state"
// @Success      302    {string}  string  "Redirect on success or error"
// @Router       /auth/callback/feide [get]
func (h *auth) handleFeideCallback(ctx *handler.Context) error {
	redirectBaseURL := h.getRedirectBaseURL(ctx)
	code, _ := ctx.QueryParam("code")
	state, _ := ctx.QueryParam("state")
	if code == "" || state == "" {
		return h.redirectWithError(ctx, authErrUnknown, redirectBaseURL)
	}

	storedState, err := ctx.R.Cookie("feide_oauth_state")
	if err != nil || storedState == nil || storedState.Value != state {
		return h.redirectWithError(ctx, authErrUnknown, redirectBaseURL)
	}

	ctx.ClearCookie("feide_oauth_state", "/", "")
	ctx.ClearCookie("site_redirect", "/", "")

	userID, email, err := h.authService.SignInWithFeide(ctx.Context(), code)
	if errors.Is(err, service.ErrNotAllowed) {
		attemptID, regErr := h.authService.RegisterSignInAttempt(email, authErrNotAllowed)
		if regErr != nil {
			h.logger.Error(ctx.Context(), "failed to register sign-in attempt", "error", regErr)
			return h.redirectWithError(ctx, authErrNotAllowed, redirectBaseURL)
		}
		return ctx.Redirect(redirectBaseURL + "/auth/logg-inn?error=" + authErrNotAllowed + "&attemptId=" + url.QueryEscape(attemptID))
	}
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to sign in with Feide", "error", err)
		return h.redirectWithError(ctx, authErrUnknown, redirectBaseURL)
	}

	_, jwt, err := h.authService.CreateSession(ctx.Context(), userID, service.SessionExpiryDays)
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to create session", "error", err)
		return h.redirectWithError(ctx, authErrUnknown, redirectBaseURL)
	}

	h.logger.Info(ctx.Context(), "user signed in via Feide", "user_id", userID)

	callbackURL := redirectBaseURL + "/api/auth/callback?token=" + url.QueryEscape(jwt)
	return ctx.Redirect(callbackURL)
}

// signOut signs the current user out
// @Summary      Sign out
// @Tags         auth
// @Security     BearerAuth
// @Success      200  {string}  string  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Router       /auth/sign-out [post]
func (h *auth) signOut(ctx *handler.Context) error {
	session, ok := handler.SessionFromContext(ctx.Context())
	if !ok {
		return ctx.Unauthorized(errors.New("session not found in context"))
	}

	if err := h.authService.DeleteSession(ctx.Context(), session.SessionToken); err != nil {
		h.logger.Error(ctx.Context(), "failed to delete session", "error", err)
		// fail silently, since we still want to clear the cookie even if the session deletion fails
	}

	h.logger.Info(ctx.Context(), "user signed out", "user_id", session.UserID)

	return ctx.Ok()
}

// getCurrentUser returns the currently authenticated user
// @Summary      Get current user
// @Tags         auth
// @Security     BearerAuth
// @Produce      json
// @Success      200  {object}  dto.UserResponse  "OK"
// @Failure      401  {string}  string            "Unauthorized"
// @Failure      500  {string}  string            "Internal Server Error"
// @Router       /auth/me [get]
func (h *auth) getCurrentUser(ctx *handler.Context) error {
	user, ok := handler.UserFromContext(ctx.Context())
	if !ok {
		return ctx.Unauthorized(errors.New("user not found in context"))
	}

	fullUser, err := h.userService.GetUserByID(ctx.Context(), user.ID)
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to get user by ID", "error", err)
		return ctx.InternalServerError()
	}

	return ctx.JSON(dto.UserResponseFromDomain(fullUser))
}

// verifyMagicLink verifies a magic link token and creates a session
// @Summary      Verify magic link
// @Tags         auth
// @Param        token  query  string  true  "Magic link token"
// @Param        email  query  string  true  "User email"
// @Success      302    {string}  string  "Redirect on success or error"
// @Failure      400    {string}  string  "Bad Request"
// @Router       /auth/magic-link/verify [get]
func (h *auth) verifyMagicLink(ctx *handler.Context) error {
	redirectBaseURL := h.getRedirectBaseURL(ctx)

	token, _ := ctx.QueryParam("token")
	email, _ := ctx.QueryParam("email")

	if token == "" || email == "" {
		return ctx.BadRequest(errors.New("missing token or email"))
	}

	// Normalize email to lowercase to ensure case-insensitive matching
	email = strings.ToLower(email)

	verificationToken, err := h.authService.GetAndMarkTokenAsUsed(ctx.Context(), email, token)
	if err != nil || verificationToken.Token == "" {
		if errors.Is(err, service.ErrExpiredToken) {
			return h.redirectWithError(ctx, authErrExpiredToken, redirectBaseURL)
		}
		h.logger.Error(ctx.Context(), "failed to get and mark verification token", "error", err)
		return h.redirectWithError(ctx, authErrInvalidToken, redirectBaseURL)
	}

	user, err := h.authService.GetUserByEmail(ctx.Context(), email)
	if err != nil {
		return h.redirectWithError(ctx, authErrUserNotFound, redirectBaseURL)
	}

	_, jwt, err := h.authService.CreateSession(ctx.Context(), user.ID, service.SessionExpiryDays)
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to create session", "error", err)
		return h.redirectWithError(ctx, authErrUnknown, redirectBaseURL)
	}

	h.logger.Info(ctx.Context(), "user signed in via magic link", "user_id", user.ID)

	callbackURL := h.config.WebBaseURL + "/api/auth/callback?token=" + url.QueryEscape(jwt)
	return ctx.Redirect(callbackURL)
}

// getSignInAttempt returns sign-in attempt data stored in Redis, used by the frontend dispute flow.
// @Summary      Get sign-in attempt
// @Tags         auth
// @Param        id   path  string  true  "Attempt ID"
// @Produce      json
// @Success      200  {object}  service.SignInAttempt  "OK"
// @Failure      404  {string}  string                "Not Found"
// @Router       /auth/sign-in-attempt/{id} [get]
func (h *auth) getSignInAttempt(ctx *handler.Context) error {
	id := ctx.PathValue("id")
	if id == "" {
		return ctx.NotFound(errors.New("not found"))
	}

	attempt, found := h.authService.GetSignInAttempt(id)
	if !found {
		return ctx.NotFound(errors.New("not found"))
	}

	return ctx.JSON(attempt)
}

// getSessionByID returns session data for a given session ID
// @Summary      Get session by ID
// @Tags         auth
// @Param        id   path  string  true  "Session ID"
// @Produce      json
// @Success      200  {object}  dto.SessionResponse  "OK"
// @Failure      401  {string}  string                "Unauthorized"
// @Failure      404  {string}  string                "Not Found"
// @Router       /auth/sessions/{id} [get]
// @Security     AdminAPIKey
func (h *auth) getSessionByID(ctx *handler.Context) error {
	id := ctx.PathValue("id")
	if id == "" {
		return ctx.NotFound(errors.New("not found"))
	}

	session, err := h.authService.GetSessionByToken(ctx.Context(), id)
	if err != nil {
		return ctx.NotFound(errors.New("not found"))
	}

	response := dto.SessionResponse{
		SessionToken: session.SessionToken,
		UserID:       session.UserID,
		ExpiresAt:    dto.FormatISO8601(session.Expires),
	}
	return ctx.JSON(response)
}

func (h *auth) redirectWithError(ctx *handler.Context, baseURL string, errCode string) error {
	return ctx.Redirect(baseURL + "/auth/logg-inn?error=" + errCode)
}

func (h *auth) getRedirectBaseURL(ctx *handler.Context) string {
	redirectBaseURL := h.config.WebBaseURL
	storedSite, err := ctx.R.Cookie("site_redirect")

	if err == nil && storedSite != nil {
		if baseUrl, ok := rule.GetWhitelistedBaseURL(storedSite.Value); ok {
			redirectBaseURL = baseUrl
		} else {
			h.logger.Warn(
				ctx.Context(),
				"site is either not whitelisted or base url is missing",
				"fallback", redirectBaseURL,
			)
		}
	}

	return redirectBaseURL
}
