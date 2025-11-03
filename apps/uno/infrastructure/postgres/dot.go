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
	p.logger.Info(ctx, "deleting expired dots")

	query := `--sql
		DELETE FROM dot
		WHERE expires_at IS NOT NULL AND expires_at <= NOW()
	`
	_, err := p.db.ExecContext(ctx, query)
	if err != nil {
		p.logger.Error(ctx, "failed to delete expired dots",
			"error", err,
		)
	}
	return nil
}

func (p *DotRepo) CreateDot(ctx context.Context, dot model.Dot) (model.Dot, error) {
	p.logger.Info(ctx, "creating dot",
		"user_id", dot.UserID,
		"count", dot.Count,
		"striked_by", dot.StrikedBy,
		"expires_at", dot.ExpiresAt,
	)

	query := `--sql
		INSERT INTO dot (user_id, count, reason, striked_by, expires_at)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, user_id, count, reason, striked_by, expires_at, created_at
	`
	var result model.Dot
	err := p.db.GetContext(ctx, &result, query, dot.UserID, dot.Count, dot.Reason, dot.StrikedBy, dot.ExpiresAt)
	if err != nil {
		p.logger.Error(ctx, "failed to create dot",
			"error", err,
			"user_id", dot.UserID,
			"count", dot.Count,
			"striked_by", dot.StrikedBy,
			"expires_at", dot.ExpiresAt,
		)
	}
	return result, nil
}
