package postgres

import (
	"context"
	"fmt"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
)

type DotRepo struct {
	db     *Database
	logger port.Logger
}

func NewDotRepo(db *Database, logger port.Logger) port.DotRepo {
	return &DotRepo{db: db, logger: logger}
}

func (p *DotRepo) DeleteExpired(ctx context.Context) error {
	p.logger.Info(ctx, "deleting expired dots")

	query := `--sql
		DELETE FROM dot
		WHERE expires_at IS NOT NULL AND expires_at <= NOW()
	`
	if _, err := p.db.ExecContext(ctx, query); err != nil {
		p.logger.Error(ctx, "failed to delete expired dots",
			"error", err,
		)
		return err
	}
	return nil
}

func (p *DotRepo) CleanupOldStrikes(ctx context.Context) (int64, error) {
	p.logger.Info(ctx, "deleting old strikes")

	query := `--sql
		DELETE FROM strike_info
		WHERE created_at < NOW() - INTERVAL '1 year'
	`
	result, err := p.db.ExecContext(ctx, query)
	if err != nil {
		p.logger.Error(ctx, "failed to delete old strikes", "error", err)
		return 0, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return 0, fmt.Errorf("cleanup old strikes rows affected: %w", err)
	}
	return rowsAffected, nil
}

func (p *DotRepo) CreateDot(ctx context.Context, dot model.NewDot) (model.Dot, error) {
	p.logger.Info(ctx, "creating dot",
		"user_id", dot.UserID,
		"count", dot.Count,
		"striked_by", dot.StrikedBy,
		"expires_at", dot.ExpiresAt,
	)

	query := `--sql
		INSERT INTO dot (user_id, count, reason, striked_by, expires_at, created_at)
		VALUES ($1, $2, $3, $4, $5, NOW())
		RETURNING id, user_id, count, reason, striked_by, expires_at, created_at
	`
	var dbModel record.DotDB
	err := p.db.GetContext(ctx, &dbModel, query, dot.UserID, dot.Count, dot.Reason, dot.StrikedBy, dot.ExpiresAt)
	if err != nil {
		p.logger.Error(ctx, "failed to create dot",
			"error", err,
			"user_id", dot.UserID,
			"count", dot.Count,
			"striked_by", dot.StrikedBy,
			"expires_at", dot.ExpiresAt,
		)
		return model.Dot{}, err
	}
	return *dbModel.ToDomain(), nil
}
