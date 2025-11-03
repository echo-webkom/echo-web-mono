package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/ports"
)

type PostgresSessionImpl struct {
	db     *Database
	logger ports.Logger
}

func NewSessionRepo(db *Database, logger ports.Logger) ports.SessionRepo {
	return &PostgresSessionImpl{db: db, logger: logger}
}

func (r *PostgresSessionImpl) GetSessionByToken(ctx context.Context, token string) (model.Session, error) {
	return model.Session{}, nil
}
