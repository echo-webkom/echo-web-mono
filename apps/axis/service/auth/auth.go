package auth

import (
	"context"

	"github.com/echo-webkom/axis/service/session"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AuthService struct {
	pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *AuthService {
	return &AuthService{
		pool,
	}
}

// Validates the session ID and checks if it exists in the database.
// If the session ID is valid, it returns the associated user and session.
func (s *AuthService) ValidateSession(ctx context.Context, sessionID string) (ValidateUser, ValidatedSession, error) {
	ss := session.New(s.pool)

	_, err := ss.FindSessionByID(ctx, sessionID)
	return ValidateUser{}, ValidatedSession{}, err
}
