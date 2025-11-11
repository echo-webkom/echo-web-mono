package postgres

import (
	"context"
	"database/sql"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/models"
)

type PostgresSessionImpl struct {
	db     *Database
	logger port.Logger
}

func NewSessionRepo(db *Database, logger port.Logger) port.SessionRepo {
	return &PostgresSessionImpl{db: db, logger: logger}
}

func (r *PostgresSessionImpl) GetSessionByToken(ctx context.Context, token string) (model.Session, error) {
	r.logger.Info(ctx, "getting session by token")

	query := `--sql
		SELECT session_token, user_id, expires
		FROM "session"
		WHERE session_token = $1
	`
	var sessionDB models.SessionDB
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
	return *sessionDB.ToDomain(), nil
}
