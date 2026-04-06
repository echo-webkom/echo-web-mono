package service

import (
	"context"
	"crypto/rand"
	"fmt"
	"strings"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/domain/service/providers"

	"github.com/golang-jwt/jwt/v5"
)

const (
	SessionExpiryDays = 30 * 24 * time.Hour // 30 days in hours
)

type AuthService struct {
	sessionRepo           port.SessionRepo
	userRepo              port.UserRepo
	authSecret            []byte
	feideProvider         *providers.FeideProvider
	whitelistRepo         port.WhitelistRepo
	accountRepo           port.AccountRepo
	verificationTokenRepo port.VerificationTokenRepo
}

type AuthServiceConfig struct {
	SessionRepo           port.SessionRepo
	UserRepo              port.UserRepo
	AuthSecret            string
	FeideProvider         *providers.FeideProvider
	WhitelistRepo         port.WhitelistRepo
	AccountRepo           port.AccountRepo
	VerificationTokenRepo port.VerificationTokenRepo
}

func NewAuthService(config AuthServiceConfig) *AuthService {
	return &AuthService{
		sessionRepo:           config.SessionRepo,
		userRepo:              config.UserRepo,
		authSecret:            []byte(config.AuthSecret),
		feideProvider:         config.FeideProvider,
		whitelistRepo:         config.WhitelistRepo,
		accountRepo:           config.AccountRepo,
		verificationTokenRepo: config.VerificationTokenRepo,
	}
}

type JWTBody struct {
	SessionID string `json:"sessionId"`
	jwt.RegisteredClaims
}

// DecodeSessionJWT verifies the JWT and extracts the claims into a JWTBody.
func (as *AuthService) DecodeSessionJWT(tokenString string) (JWTBody, error) {
	if len(as.authSecret) == 0 {
		return JWTBody{}, fmt.Errorf("auth secret not configured")
	}

	token, err := jwt.ParseWithClaims(tokenString, &JWTBody{}, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return as.authSecret, nil
	})
	if err != nil {
		return JWTBody{}, fmt.Errorf("invalid JWT: %w", err)
	}

	claims, ok := token.Claims.(*JWTBody)
	if !ok || claims.SessionID == "" {
		return JWTBody{}, fmt.Errorf("invalid JWT claims")
	}

	return *claims, nil
}

// CreateSessionJWT creates a signed JWT for the given session ID.
func (as *AuthService) CreateSessionJWT(sessionID string) (string, error) {
	if len(as.authSecret) == 0 {
		return "", fmt.Errorf("auth secret not configured")
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, JWTBody{
		SessionID: sessionID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(SessionExpiryDays)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	})
	return token.SignedString(as.authSecret)
}

// CreateSession creates a new session for the user and returns the session with JWT cookie value.
func (as *AuthService) CreateSession(ctx context.Context, userID string, expiry time.Duration) (model.Session, string, error) {
	sessionToken, err := generateSessionToken()
	if err != nil {
		return model.Session{}, "", err
	}
	expiresAt := time.Now().Add(expiry)

	session, err := as.sessionRepo.CreateSession(ctx, model.NewSession{
		SessionToken: sessionToken,
		UserID:       userID,
		Expires:      expiresAt,
	})
	if err != nil {
		return model.Session{}, "", fmt.Errorf("failed to create session: %w", err)
	}

	if err := as.userRepo.UpdateUserLastSignIn(ctx, userID); err != nil {
		return model.Session{}, "", fmt.Errorf("failed to update last sign in: %w", err)
	}

	jwt, err := as.CreateSessionJWT(sessionToken)
	if err != nil {
		return model.Session{}, "", fmt.Errorf("failed to create session JWT: %w", err)
	}

	return session, jwt, nil
}

// DeleteSession deletes a session from the database by raw session token.
func (as *AuthService) DeleteSession(ctx context.Context, sessionToken string) error {
	return as.sessionRepo.DeleteSession(ctx, sessionToken)
}

// GetUserBySessionToken validates the session token and returns the user with relations.
func (as *AuthService) GetUserBySessionToken(ctx context.Context, token string) (model.User, error) {
	jwtBody, err := as.DecodeSessionJWT(token)
	if err != nil {
		return model.User{}, err
	}

	session, err := as.sessionRepo.GetSessionByToken(ctx, jwtBody.SessionID)
	if err != nil {
		return model.User{}, err
	}

	if session.IsExpired(time.Now()) {
		return model.User{}, fmt.Errorf("session expired")
	}

	user, err := as.userRepo.GetUserByID(ctx, session.UserID)
	if err != nil {
		return model.User{}, err
	}

	return user, nil
}

// ValidateToken validates the session token and returns the user and session.
func (as *AuthService) ValidateToken(ctx context.Context, token string) (model.User, model.Session, error) {
	jwt, err := as.DecodeSessionJWT(token)
	if err != nil {
		return model.User{}, model.Session{}, err
	}

	session, err := as.sessionRepo.GetSessionByToken(ctx, jwt.SessionID)
	if err != nil {
		return model.User{}, model.Session{}, err
	}

	user, err := as.userRepo.GetUserByID(ctx, session.UserID)
	if err != nil {
		return model.User{}, model.Session{}, err
	}

	return user, session, nil
}

func (as *AuthService) GetUserMemberships(ctx context.Context, userID string) ([]string, error) {
	return as.userRepo.GetUserMemberships(ctx, userID)
}

// CreateFeideAuthorizationURL generates the Feide authorization URL with the given state parameter.
func (as *AuthService) CreateFeideAuthorizationURL(state string) (string, error) {
	return as.feideProvider.CreateAuthorizationURL(state), nil
}

// ExchangeFeideCode exchanges the authorization code for an access token using the Feide provider.
func (as *AuthService) ExchangeFeideCode(ctx context.Context, code string) (*providers.Token, error) {
	return as.feideProvider.ExchangeCode(ctx, code)
}

// GetFeideUserInfo retrieves the user's information from Feide using the access token.
func (as *AuthService) GetFeideUserInfo(ctx context.Context, accessToken string) (*providers.UserInfo, error) {
	return as.feideProvider.GetUserInfo(ctx, accessToken)
}

// GetAccountByProvider retrieves an account by provider and provider account ID.
func (as *AuthService) GetAccountByProvider(ctx context.Context, provider string, providerAccountID string) (model.Account, error) {
	return as.accountRepo.GetAccountByProvider(ctx, provider, providerAccountID)
}

// GetUserByEmail retrieves a user by their email address.
func (as *AuthService) GetUserByEmail(ctx context.Context, email string) (model.User, error) {
	return as.userRepo.GetUserByEmail(ctx, email)
}

// CreateUserAndAccount creates a new user and associated account for the given provider.
func (as *AuthService) CreateUserAndAccount(ctx context.Context, user model.User, account model.NewAccount) (model.User, error) {
	return as.userRepo.CreateUserAndAccount(ctx, user, account)
}

// CreateAccount creates a new account linked to an existing user.
func (as *AuthService) CreateAccount(ctx context.Context, account model.NewAccount) (model.Account, error) {
	return as.accountRepo.CreateAccount(ctx, account)
}

// UpdateAccount updates the token fields of an existing provider account.
func (as *AuthService) UpdateAccount(ctx context.Context, provider, providerAccountID string, update model.UpdateAccount) (model.Account, error) {
	return as.accountRepo.UpdateAccount(ctx, provider, providerAccountID, update)
}

// GetVerificationToken retrieves a verification token by its token string.
func (as *AuthService) GetVerificationToken(ctx context.Context, email string, token string) (model.VerificationToken, error) {
	return as.verificationTokenRepo.GetVerificationToken(ctx, email, token)
}

// MarkTokenAsUsed marks a verification token as used in the database.
func (as *AuthService) MarkTokenAsUsed(ctx context.Context, email string, token string) error {
	return as.verificationTokenRepo.MarkTokenAsUsed(ctx, email, token)
}

// GetAndMarkTokenAsUsed atomically retrieves and marks a verification token as used, preventing race conditions.
func (as *AuthService) GetAndMarkTokenAsUsed(ctx context.Context, email string, token string) (model.VerificationToken, error) {
	return as.verificationTokenRepo.GetAndMarkTokenAsUsed(ctx, email, token)
}

// IsAllowedToSignIn checks if the user is allowed to sign in based on their Feide group membership or email whitelist.
// We only allow students at the institution to sign in, or users that are whitelisted by email.
// We check if the user is a member of any of the allowed Feide groups. If not, we check if their email is whitelisted.
func (as *AuthService) IsAllowedToSignIn(ctx context.Context, userInfo *providers.UserInfo, accessToken string) (bool, error) {
	isMember, err := as.feideProvider.IsMemberOf(ctx, accessToken)
	if err != nil {
		return false, err
	}
	if isMember {
		return true, nil
	}
	email := strings.ToLower(userInfo.Email)
	if email == "" {
		return false, nil
	}
	return as.whitelistRepo.IsWhitelisted(ctx, email)
}

// generateSessionToken generates a secure random session token using crypto/rand.
func generateSessionToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", fmt.Errorf("failed to generate session token: %w", err)
	}
	return fmt.Sprintf("%x", b)[:40], nil
}
