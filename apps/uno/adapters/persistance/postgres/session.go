package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type PostgresSessionImpl struct {
	db *Database
}

func (r *PostgresSessionImpl) GetSessionByToken(ctx context.Context, token string) (model.Session, error) {
	return model.Session{}, nil
}

func NewSessionRepo(db *Database) repo.SessionRepo {
	return &PostgresSessionImpl{db: db}
}
