package session

import (
	"context"
	"fmt"
	"time"

	"github.com/echo-webkom/uno/storage/database"
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

func (s *SessionService) FindSessionByUserID(ctx context.Context, userID string) (sesh database.Session, err error) {
	query := `--sql
		SELECT session_token, user_id, expires_at
		FROM session
		WHERE user_id = $1
	`

	err = s.pool.QueryRow(ctx, query, userID).Scan(
		&sesh.SessionToken,
		&sesh.UserID,
		&sesh.Expires,
	)

	return sesh, nil
}

func (s *SessionService) FindSessionBySessionID(ctx context.Context, sessionID string) (database.Session, error) {
	var session database.Session

	query := `--sql
		SELECT session_token, user_id, expires_at
		FROM session
		WHERE session_token = $1
	`

	err := s.pool.QueryRow(ctx, query, sessionID).Scan(
		&session.SessionToken,
		&session.UserID,
		&session.Expires,
	)

	if err != nil {
		return database.Session{}, fmt.Errorf("query failed: %w", err)
	}

	return session, nil
}

// Creates a new session in the database for the given user ID and returns new
// session id/token and expiration date.
func (s *SessionService) CreateSession(ctx context.Context, userID string) (seshId string, expires time.Time, err error) {
	id, err := gonanoid.New(40)
	if err != nil {
		return "", time.Now(), nil
	}

	expiresAt := time.Now().AddDate(0, 0, 30)

	query := `--sql
		INSERT INTO session (session_token, user_id, expires)
		VALUES $1, $2, $3
	`

	_, err = s.pool.Exec(ctx, query, id, userID, expiresAt)
	if err != nil {
		return "", time.Now(), nil
	}

	return id, expiresAt, nil
}

// Deletes a session from the database.
func (s *SessionService) DeleteSession(ctx context.Context, sessionID string) error {
	query := `--sql
		DELETE FROM session
		WHERE session_token = $1
	`

	_, err := s.pool.Exec(ctx, query, sessionID)

	return err
}
