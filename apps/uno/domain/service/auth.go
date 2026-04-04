package service

import (
	"context"
	"fmt"
	"uno/domain/model"
	"uno/domain/port"

	"github.com/golang-jwt/jwt/v5"
)

type AuthService struct {
	sessionRepo port.SessionRepo
	userRepo    port.UserRepo
	authSecret  []byte
}

func NewAuthService(sessionRepo port.SessionRepo, userRepo port.UserRepo, authSecret string) *AuthService {
	return &AuthService{
		sessionRepo: sessionRepo,
		userRepo:    userRepo,
		authSecret:  []byte(authSecret),
	}
}

type JWTBody struct {
	SessionID string `json:"sessionId"`
}

// DecodeSessionJWT verifies the JWT and extracts the claims into a JWTBody.
func (as *AuthService) DecodeSessionJWT(tokenString string) (JWTBody, error) {
	if len(as.authSecret) == 0 {
		return JWTBody{}, fmt.Errorf("auth secret not configured")
	}

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (any, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return as.authSecret, nil
	})
	if err != nil {
		return JWTBody{}, fmt.Errorf("invalid JWT: %w", err)
	}

	claims, ok := token.Claims.(jwt.MapClaims)
	if !ok {
		return JWTBody{}, fmt.Errorf("invalid JWT claims")
	}

	sessionId, ok := claims["sessionId"].(string)
	if !ok || sessionId == "" {
		return JWTBody{}, fmt.Errorf("missing sessionId in JWT")
	}

	return JWTBody{SessionID: sessionId}, nil
}

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
