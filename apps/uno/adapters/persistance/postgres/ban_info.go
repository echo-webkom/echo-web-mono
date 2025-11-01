package postgres

import (
	"context"
	"uno/domain/repo"
)

type BanInfoRepo struct {
	db *Database
}

func (p *BanInfoRepo) DeleteExpired(ctx context.Context) error {
	panic("unimplemented")
}

func NewBanInfoRepo(db *Database) repo.BanInfoRepo {
	return &BanInfoRepo{db}
}
