package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type WhitelistRepo struct {
	db *Database
}

func (p *WhitelistRepo) GetWhitelist(ctx context.Context) (whitelist []model.Whitelist, err error) {
	whitelist = []model.Whitelist{}
	query := `--sql
		SELECT email, expires_at, reason
		FROM whitelist
		WHERE expires_at > NOW()
		ORDER BY expires_at DESC
	`
	err = p.db.SelectContext(ctx, &whitelist, query)
	return whitelist, err
}

func (p *WhitelistRepo) GetWhitelistByEmail(ctx context.Context, email string) (wl model.Whitelist, err error) {
	query := `--sql
		SELECT email, expires_at, reason
		FROM whitelist
		WHERE email = $1
	`
	err = p.db.GetContext(ctx, &wl, query, email)
	return wl, err
}

func (p *WhitelistRepo) IsWhitelisted(ctx context.Context, email string) (bool, error) {
	query := `--sql
		SELECT COUNT(1)
		FROM whitelist
		WHERE email = $1
	`
	var count int
	err := p.db.GetContext(ctx, &count, query, email)
	return count > 0, err
}

func (p *WhitelistRepo) CreateWhitelist(ctx context.Context, whitelist model.Whitelist) (model.Whitelist, error) {
	query := `--sql
		INSERT INTO whitelist (email, expires_at, reason)
		VALUES ($1, $2, $3)
		RETURNING email, expires_at, reason
	`
	var result model.Whitelist
	err := p.db.GetContext(ctx, &result, query, whitelist.Email, whitelist.ExpiresAt, whitelist.Reason)
	return result, err
}

func NewWhitelistRepo(db *Database) repo.WhitelistRepo {
	return &WhitelistRepo{db: db}
}
