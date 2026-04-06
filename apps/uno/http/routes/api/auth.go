package api

import (
	"errors"
	"net/http"
	"net/url"
	"strings"
	"uno/config"
	"uno/domain/port"
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
	code, _ := ctx.QueryParam("code")
	state, _ := ctx.QueryParam("state")
	if code == "" || state == "" {
		return h.redirectWithError(ctx, authErrUnknown)
	}

	storedState, err := ctx.R.Cookie("feide_oauth_state")
	if err != nil || storedState == nil || storedState.Value != state {
		return h.redirectWithError(ctx, authErrUnknown)
	}

	ctx.ClearCookie("feide_oauth_state", "/", "")

	userID, err := h.authService.SignInWithFeide(ctx.Context(), code)
	if errors.Is(err, service.ErrNotAllowed) {
		h.logger.Info(ctx.Context(), "user not allowed to sign in via Feide")
		return h.redirectWithError(ctx, authErrNotAllowed)
	}
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to sign in with Feide", "error", err)
		return h.redirectWithError(ctx, authErrUnknown)
	}

	_, jwt, err := h.authService.CreateSession(ctx.Context(), userID, service.SessionExpiryDays)
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to create session", "error", err)
		return h.redirectWithError(ctx, authErrUnknown)
	}

	h.logger.Info(ctx.Context(), "user signed in via Feide", "user_id", userID)

	callbackURL := h.config.WebBaseURL + "/api/auth/callback?token=" + url.QueryEscape(jwt)
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
			return h.redirectWithError(ctx, authErrExpiredToken)
		}
		h.logger.Error(ctx.Context(), "failed to get and mark verification token", "error", err)
		return h.redirectWithError(ctx, authErrInvalidToken)
	}

	user, err := h.authService.GetUserByEmail(ctx.Context(), email)
	if err != nil {
		return h.redirectWithError(ctx, authErrUserNotFound)
	}

	_, jwt, err := h.authService.CreateSession(ctx.Context(), user.ID, service.SessionExpiryDays)
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to create session", "error", err)
		return h.redirectWithError(ctx, authErrUnknown)
	}

	h.logger.Info(ctx.Context(), "user signed in via magic link", "user_id", user.ID)

	callbackURL := h.config.WebBaseURL + "/api/auth/callback?token=" + url.QueryEscape(jwt)
	return ctx.Redirect(callbackURL)
}


func (h *auth) redirectWithError(ctx *handler.Context, errCode string) error {
	return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=" + errCode)
}
