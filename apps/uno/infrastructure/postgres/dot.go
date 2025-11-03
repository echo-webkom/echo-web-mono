package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/ports"
)

type DotRepo struct {
	db     *Database
	logger ports.Logger
}

func NewDotRepo(db *Database, logger ports.Logger) ports.DotRepo {
	return &DotRepo{db: db, logger: logger}
}

func (p *DotRepo) DeleteExpired(ctx context.Context) error {
	query := `--sql
		DELETE FROM dot
		WHERE expires_at IS NOT NULL AND expires_at <= NOW()
	`
	_, err := p.db.ExecContext(ctx, query)
	return err
}

func (p *DotRepo) CreateDot(ctx context.Context, dot model.Dot) (model.Dot, error) {
	query := `--sql
		INSERT INTO dot (user_id, count, reason, striked_by, expires_at)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, user_id, count, reason, striked_by, expires_at, created_at
	`
	var result model.Dot
	err := p.db.GetContext(ctx, &result, query, dot.UserID, dot.Count, dot.Reason, dot.StrikedBy, dot.ExpiresAt)
	return result, err
}
