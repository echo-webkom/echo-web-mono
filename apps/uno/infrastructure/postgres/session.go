package postgres

import (
	"context"
	"database/sql"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
)

type PostgresSessionImpl struct {
	db     *Database
	logger port.Logger
}

func NewSessionRepo(db *Database, logger port.Logger) port.SessionRepo {
	return &PostgresSessionImpl{db: db, logger: logger}
}

// GetSessionByToken retrieves a session from the database using the provided session token.
// The method checks if the session exists and has not expired.
func (r *PostgresSessionImpl) GetSessionByToken(ctx context.Context, token string) (model.Session, error) {
	r.logger.Info(ctx, "getting session by token")

	query := `--sql
		SELECT session_token, user_id, expires
		FROM "session"
		WHERE session_token = $1
		AND expires > NOW()
	`
	var sessionDB record.SessionDB
	err := r.db.GetContext(ctx, &sessionDB, query, token)
	if err == sql.ErrNoRows {
		r.logger.Info(ctx, "no session found for token",
			"token", token,
		)
		return model.Session{}, nil
	}
	if err != nil {
		r.logger.Error(ctx, "failed to get session by token",
			"error", err,
		)
		return model.Session{}, err
	}
	return sessionDB.ToDomain(), nil
}

// CreateSession creates a new session in the database.
func (r *PostgresSessionImpl) CreateSession(ctx context.Context, session model.NewSession) (model.Session, error) {
	r.logger.Info(ctx, "creating session",
		"user_id", session.UserID,
	)

	query := `--sql
		INSERT INTO "session" (session_token, user_id, expires)
		VALUES ($1, $2, $3)
		RETURNING session_token, user_id, expires
	`
	var sessionDB record.SessionDB
	err := r.db.GetContext(ctx, &sessionDB, query, session.SessionToken, session.UserID, session.Expires)
	if err != nil {
		r.logger.Error(ctx, "failed to create session",
			"error", err,
			"user_id", session.UserID,
		)
		return model.Session{}, err
	}
	return sessionDB.ToDomain(), nil
}

// DeleteSession deletes a session from the database.
func (r *PostgresSessionImpl) DeleteSession(ctx context.Context, token string) error {
	r.logger.Info(ctx, "deleting session",
		"token", token,
	)

	query := `--sql
		DELETE FROM "session"
		WHERE session_token = $1
	`
	_, err := r.db.ExecContext(ctx, query, token)
	if err != nil {
		r.logger.Error(ctx, "failed to delete session",
			"error", err,
			"token", token,
		)
		return err
	}
	return nil
}
