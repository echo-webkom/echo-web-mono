package whitelist

import (
	"context"

	"github.com/echo-webkom/uno/storage/database"
	"github.com/jackc/pgx/v5/pgxpool"
)

type WhitelistService struct {
	pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *WhitelistService {
	return &WhitelistService{
		pool,
	}
}

func (s *WhitelistService) ListWhitelist(ctx context.Context) ([]database.Whitelist, error) {
	query := `--sql
		SELECT email, expires_at, reason FROM whitelist
	`

	whitelists := []database.Whitelist{}
	rows, err := s.pool.Query(ctx, query)
	if err != nil {
		return nil, err
	}

	defer rows.Close()
	for rows.Next() {
		var w database.Whitelist
		if err := rows.Scan(&w.Email, &w.ExpiresAt, &w.Reason); err != nil {
			return nil, err
		}
		whitelists = append(whitelists, w)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return whitelists, nil
}

func (s *WhitelistService) GetWhitelist(ctx context.Context, email string) (database.Whitelist, error) {
	query := `--sql
		SELECT email, expires_at, reason FROM whitelist WHERE email = $1
	`

	var w database.Whitelist
	err := s.pool.QueryRow(ctx, query, email).Scan(
		&w.Email,
		&w.ExpiresAt,
		&w.Reason,
	)
	if err != nil {
		return database.Whitelist{}, err
	}
	return w, nil
}
