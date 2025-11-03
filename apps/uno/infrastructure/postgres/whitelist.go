package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/ports"
)

type WhitelistRepo struct {
	db     *Database
	logger ports.Logger
}

func NewWhitelistRepo(db *Database, logger ports.Logger) ports.WhitelistRepo {
	return &WhitelistRepo{db: db, logger: logger}
}

func (p *WhitelistRepo) GetWhitelist(ctx context.Context) (whitelist []model.Whitelist, err error) {
	p.logger.Info(ctx, "getting whitelist")

	whitelist = []model.Whitelist{}
	query := `--sql
		SELECT email, expires_at, reason
		FROM whitelist
		WHERE expires_at > NOW()
		ORDER BY expires_at DESC
	`
	err = p.db.SelectContext(ctx, &whitelist, query)
	if err != nil {
		p.logger.Error(ctx, "failed to get whitelist",
			"error", err,
		)
	}
	return whitelist, err
}

func (p *WhitelistRepo) GetWhitelistByEmail(ctx context.Context, email string) (wl model.Whitelist, err error) {
	p.logger.Info(ctx, "getting whitelist by email",
		"email", email,
	)

	query := `--sql
		SELECT email, expires_at, reason
		FROM whitelist
		WHERE email = $1
	`
	err = p.db.GetContext(ctx, &wl, query, email)
	if err != nil {
		p.logger.Error(ctx, "failed to get whitelist by email",
			"error", err,
			"email", email,
		)
	}
	return wl, err
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
	err := p.db.GetContext(ctx, &count, query, email)
	if err != nil {
		p.logger.Error(ctx, "failed to check if email is whitelisted",
			"error", err,
			"email", email,
		)
	}
	return count > 0, err
}

func (p *WhitelistRepo) CreateWhitelist(ctx context.Context, whitelist model.Whitelist) (model.Whitelist, error) {
	p.logger.Info(ctx, "creating whitelist entry",
		"email", whitelist.Email,
		"expires_at", whitelist.ExpiresAt,
	)

	query := `--sql
		INSERT INTO whitelist (email, expires_at, reason)
		VALUES ($1, $2, $3)
		RETURNING email, expires_at, reason
	`
	var result model.Whitelist
	err := p.db.GetContext(ctx, &result, query, whitelist.Email, whitelist.ExpiresAt, whitelist.Reason)
	if err != nil {
		p.logger.Error(ctx, "failed to create whitelist entry",
			"error", err,
			"email", whitelist.Email,
		)
	}
	return result, err
}
