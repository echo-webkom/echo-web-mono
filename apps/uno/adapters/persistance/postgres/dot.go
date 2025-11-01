package postgres

import (
	"context"
	"uno/domain/repo"
)

type DotRepo struct {
	db *Database
}

func (p *DotRepo) DeleteExpired(ctx context.Context) error {
	query := `
		DELETE FROM dot
		WHERE expires_at IS NOT NULL AND expires_at <= NOW()
	`
	_, err := p.db.ExecContext(ctx, query)
	return err
}

func NewDotRepo(db *Database) repo.DotRepo {
	return &DotRepo{db}
}
