package api

import (
	"errors"
	"net/http"
	"net/url"
	"strings"
	"time"
	"uno/config"
	"uno/domain/model"
	"uno/domain/port"
	"uno/domain/service"
	"uno/domain/service/providers"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
	"uno/pkg/ptr"
	"uno/pkg/randid"
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
		return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=missing_code_or_state")
	}

	storedState, err := ctx.R.Cookie("feide_oauth_state")
	if err != nil || storedState == nil || storedState.Value != state {
		return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=invalid_state")
	}

	ctx.ClearCookie("feide_oauth_state", "/", "")

	tokens, err := h.authService.ExchangeFeideCode(ctx.Context(), code)
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to exchange Feide code", "error", err)
		return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=token_exchange_failed")
	}

	userInfo, err := h.authService.GetFeideUserInfo(ctx.Context(), tokens.AccessToken)
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to get Feide user info", "error", err)
		return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=user_info_failed")
	}

	allowed, err := h.authService.IsAllowedToSignIn(ctx.Context(), userInfo, tokens.AccessToken)
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to check if user is allowed to sign in", "error", err)
		return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=auth_check_failed")
	}

	if !allowed {
		h.logger.Info(ctx.Context(), "user not allowed to sign in", "email", userInfo.Email)
		return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=not_allowed")
	}

	existingAccount, err := h.authService.GetAccountByProvider(ctx.Context(), providers.FeideProviderName, userInfo.Sub)
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to check existing account", "error", err)
		return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=account_check_failed")
	}

	normalizedEmail := strings.ToLower(userInfo.Email)
	var userID string

	if existingAccount.UserID != "" {
		userID = existingAccount.UserID
		if _, err := h.authService.UpdateAccount(ctx.Context(), providers.FeideProviderName, userInfo.Sub, model.UpdateAccount{
			AccessToken:  &tokens.AccessToken,
			RefreshToken: ptr.Of(tokens.RefreshToken),
			ExpiresAt:    ptr.Of(tokens.ExpiresIn),
			TokenType:    &tokens.TokenType,
			IDToken:      &tokens.IDToken,
		}); err != nil {
			h.logger.Error(ctx.Context(), "failed to update account tokens", "error", err)
			// not necessarily critical, so we can proceed with the sign in process
		}
	} else {
		existingUser, err := h.authService.GetUserByEmail(ctx.Context(), normalizedEmail)
		if err == nil && existingUser.ID != "" {
			userID = existingUser.ID
			if _, err := h.authService.CreateAccount(ctx.Context(), model.NewAccount{
				UserID:            existingUser.ID,
				Type:              "oauth",
				Provider:          providers.FeideProviderName,
				ProviderAccountID: userInfo.Sub,
				AccessToken:       &tokens.AccessToken,
				RefreshToken:      ptr.Of(tokens.RefreshToken),
				ExpiresAt:         ptr.Of(tokens.ExpiresIn),
				TokenType:         &tokens.TokenType,
				Scope:             ptr.Of("openid email profile groups"),
				IDToken:           &tokens.IDToken,
			}); err != nil {
				h.logger.Error(ctx.Context(), "failed to link Feide account to existing user", "error", err)
				return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=account_link_failed")
			}
		} else {
			id, err := randid.Generate(24)
			if err != nil {
				h.logger.Error(ctx.Context(), "failed to generate ID", "error", err)
				return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=user_creation_failed")
			}

			user := model.User{
				ID:           id,
				Name:         &userInfo.Name,
				Email:        normalizedEmail,
				Type:         model.UserTypeStudent,
				LastSignInAt: ptr.Of(time.Now()),
			}

			account := model.NewAccount{
				UserID:            id,
				Type:              "oauth",
				Provider:          providers.FeideProviderName,
				ProviderAccountID: userInfo.Sub,
				AccessToken:       &tokens.AccessToken,
				RefreshToken:      ptr.Of(tokens.RefreshToken),
				ExpiresAt:         ptr.Of(tokens.ExpiresIn),
				TokenType:         &tokens.TokenType,
				Scope:             ptr.Of("openid email profile groups"),
				IDToken:           &tokens.IDToken,
			}

			createdUser, err := h.authService.CreateUserAndAccount(ctx.Context(), user, account)
			if err != nil {
				h.logger.Error(ctx.Context(), "failed to create user and account", "error", err)
				return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=user_creation_failed")
			}
			userID = createdUser.ID
		}
	}

	session, jwt, err := h.authService.CreateSession(ctx.Context(), userID, service.SessionExpiryDays)
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to create session", "error", err)
		return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=session_creation_failed")
	}

	ctx.SetCookie(h.sessionCookie(jwt, session.Expires))

	h.logger.Info(ctx.Context(), "user signed in via Feide", "user_id", userID)

	return ctx.Redirect(h.config.WebBaseURL)
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

	ctx.ClearCookie("session-token", "/", rootDomain(h.config.UnoBaseURL))

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
		if errors.Is(err, model.ErrVerificationTokenExpired) {
			return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=expired-token")
		}
		h.logger.Error(ctx.Context(), "failed to get and mark verification token", "error", err)
		return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=invalid-token")
	}

	user, err := h.authService.GetUserByEmail(ctx.Context(), email)
	if err != nil {
		return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=user-not-found")
	}

	session, jwt, err := h.authService.CreateSession(ctx.Context(), user.ID, service.SessionExpiryDays)
	if err != nil {
		h.logger.Error(ctx.Context(), "failed to create session", "error", err)
		return ctx.Redirect(h.config.WebBaseURL + "/auth/logg-inn?error=session_creation_failed")
	}

	ctx.SetCookie(h.sessionCookie(jwt, session.Expires))

	h.logger.Info(ctx.Context(), "user signed in via magic link", "user_id", user.ID)

	return ctx.Redirect(h.config.WebBaseURL)
}

func (h *auth) sessionCookie(value string, expires time.Time) *http.Cookie {
	isSecure := h.config.Environment != config.Development
	return &http.Cookie{
		Name:     "session-token",
		Value:    value,
		Path:     "/",
		Domain:   rootDomain(h.config.UnoBaseURL),
		Expires:  expires,
		HttpOnly: true,
		Secure:   isSecure,
		SameSite: http.SameSiteLaxMode,
	}
}

func rootDomain(baseURL string) string {
	u, err := url.Parse(baseURL)
	if err != nil {
		return baseURL
	}
	host := u.Hostname()
	// Extract the root domain (api.example.com -> example.com)
	parts := strings.Split(host, ".")
	if len(parts) >= 2 {
		return strings.Join(parts[len(parts)-2:], ".")
	}
	return host
}
