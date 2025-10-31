package postgres

import (
	"context"
	"uno/domain/repo"
)

type PostgresDotImpl struct {
	db *Database
}

func (p *PostgresDotImpl) DeleteExpired(ctx context.Context) error {
	panic("unimplemented")
}

func NewPostgresDotImpl(db *Database) repo.DotRepo {
	return &PostgresDotImpl{db}
}
