package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type PostgresSessionImpl struct {
	db *Database
}

func NewPostgresSessionImpl(db *Database) repo.SessionRepo {
	return &PostgresSessionImpl{db: db}
}

func (r *PostgresSessionImpl) GetSessionByToken(ctx context.Context, token string) (model.Session, error) {
	return model.Session{}, nil
}
