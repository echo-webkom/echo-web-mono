package postgres

import (
	"context"
	"database/sql"
	"errors"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
)

type WhitelistRepo struct {
	db     *Database
	logger port.Logger
}

func NewWhitelistRepo(db *Database, logger port.Logger) port.WhitelistRepo {
	return &WhitelistRepo{db: db, logger: logger}
}

func (p *WhitelistRepo) GetWhitelist(ctx context.Context) (whitelist []model.Whitelist, err error) {
	p.logger.Info(ctx, "getting whitelist")

	var dbModels []record.WhitelistDB
	query := `--sql
		SELECT email, expires_at, reason
		FROM whitelist
		WHERE expires_at > NOW()
		ORDER BY expires_at DESC
	`
	err = p.db.SelectContext(ctx, &dbModels, query)
	if err != nil {
		p.logger.Error(ctx, "failed to get whitelist",
			"error", err,
		)
		return nil, err
	}
	return record.ToWhitelistDomainList(dbModels), nil
}

func (p *WhitelistRepo) GetWhitelistByEmail(ctx context.Context, email string) (wl model.Whitelist, err error) {
	p.logger.Info(ctx, "getting whitelist by email",
		"email", email,
	)

	var dbModel record.WhitelistDB
	query := `--sql
		SELECT email, expires_at, reason
		FROM whitelist
		WHERE email = $1
	`
	err = p.db.GetContext(ctx, &dbModel, query, email)
	if err != nil {
		if !errors.Is(err, sql.ErrNoRows) {
			p.logger.Error(ctx, "failed to get whitelist by email",
				"error", err,
				"email", email,
			)
		}
		return model.Whitelist{}, err
	}
	return *dbModel.ToDomain(), nil
}

func (p *WhitelistRepo) IsWhitelisted(ctx context.Context, email string) (bool, error) {
	p.logger.Info(ctx, "checking if email is whitelisted",
		"email", email,
	)

	query := `--sql
		SELECT COUNT(1)
		FROM whitelist
		WHERE email = $1
	`
	var count int
	if err := p.db.GetContext(ctx, &count, query, email); err != nil {
		p.logger.Error(ctx, "failed to check if email is whitelisted",
			"error", err,
			"email", email,
		)
		return false, err
	}
	return count > 0, nil
}

func (p *WhitelistRepo) CreateWhitelist(ctx context.Context, whitelist model.NewWhitelist) (model.Whitelist, error) {
	p.logger.Info(ctx, "creating whitelist entry",
		"email", whitelist.Email,
		"expires_at", whitelist.ExpiresAt,
	)

	query := `--sql
		INSERT INTO whitelist (email, expires_at, reason)
		VALUES ($1, $2, $3)
		RETURNING email, expires_at, reason
	`
	var dbModel record.WhitelistDB
	err := p.db.GetContext(ctx, &dbModel, query, whitelist.Email, whitelist.ExpiresAt, whitelist.Reason)
	if err != nil {
		p.logger.Error(ctx, "failed to create whitelist entry",
			"error", err,
			"email", whitelist.Email,
		)
		return model.Whitelist{}, err
	}
	return *dbModel.ToDomain(), nil
}
