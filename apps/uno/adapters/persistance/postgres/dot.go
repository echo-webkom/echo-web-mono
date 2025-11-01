package postgres

import (
	"context"
	"uno/domain/repo"
)

type DotRepo struct {
	db *Database
}

func (p *DotRepo) DeleteExpired(ctx context.Context) error {
	panic("unimplemented")
}

func NewDotRepo(db *Database) repo.DotRepo {
	return &DotRepo{db}
}
