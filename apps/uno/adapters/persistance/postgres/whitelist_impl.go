package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type PostgresWhitelistImpl struct {
	db *Database
}

func (p *PostgresWhitelistImpl) GetWhitelist(ctx context.Context) (whitelist []model.Whitelist, err error) {
	query := `
		SELECT email, expires_at, reason
		FROM whitelist
		ORDER BY expires_at DESC
	`
	err = p.db.SelectContext(ctx, &whitelist, query)
	return whitelist, err
}

func (p *PostgresWhitelistImpl) GetWhitelistByEmail(ctx context.Context, email string) (wl model.Whitelist, err error) {
	query := `
		SELECT email, expires_at, reason
		FROM whitelist
		WHERE email = $1
	`
	err = p.db.GetContext(ctx, &wl, query, email)
	return wl, err
}

func (p *PostgresWhitelistImpl) IsWhitelisted(ctx context.Context, email string) (bool, error) {
	query := `
		SELECT COUNT(1)
		FROM whitelist
		WHERE email = $1
	`
	var count int
	err := p.db.GetContext(ctx, &count, query, email)
	return count > 0, err
}

func NewPostgresWhitelistImpl(db *Database) repo.WhitelistRepo {
	return &PostgresWhitelistImpl{db: db}
}
