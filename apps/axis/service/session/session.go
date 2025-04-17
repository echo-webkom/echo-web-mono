package session

import (
	"context"
	"fmt"
	"time"

	"github.com/echo-webkom/axis/storage/database"
	"github.com/jackc/pgx/v5/pgxpool"
	gonanoid "github.com/matoous/go-nanoid/v2"
)

type SessionService struct {
	pool *pgxpool.Pool
}

func New(db *pgxpool.Pool) *SessionService {
	return &SessionService{
		db,
	}
}

// Finds a session by its ID
func (s *SessionService) FindSessionByID(ctx context.Context, sessionID string) (database.Session, error) {
	var session database.Session

	err := s.pool.QueryRow(ctx, `
		SELECT session_token, user_id, expires_at
		FROM session
		WHERE session_token = $1
	`, sessionID).Scan(
		&session.SessionToken,
		&session.UserID,
		&session.Expires,
	)

	if err != nil {
		return database.Session{}, fmt.Errorf("query failed: %w", err)
	}

	return session, nil
}

// Creates a new session in the database for the given user ID.
func (s *SessionService) CreateSession(ctx context.Context, userID string) (string, error) {
	id, err := gonanoid.New(40)
	if err != nil {
		return "", nil
	}

	expiresAt := time.Now().AddDate(0, 0, 30)

	_, err = s.pool.Exec(ctx, `
		INSERT INTO session (session_token, user_id, expires)
		VALUES $1, $2, $3
	`, id, userID, expiresAt)
	if err != nil {
		return "", nil
	}

	return id, nil
}

// Deletes a session from the database.
func (s *SessionService) DeleteSession(ctx context.Context, sessionID string) error {
	_, err := s.pool.Exec(ctx, `
		DELETE FROM session
		WHERE session_token = $1
	`, sessionID)

	return err
}
