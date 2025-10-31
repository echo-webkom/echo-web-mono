package postgres

import (
	"context"
	"uno/domain/repo"
)

type PostgresBanInfoImpl struct {
	db *Database
}

func (p *PostgresBanInfoImpl) DeleteExpired(ctx context.Context) error {
	panic("unimplemented")
}

func NewPostgresBanInfoImpl(db *Database) repo.BanInfoRepo {
	return &PostgresBanInfoImpl{db}
}
