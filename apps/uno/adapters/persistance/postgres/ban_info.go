package postgres

import (
	"context"
	"database/sql"
	"uno/domain/model"
	"uno/domain/repo"
)

type BanInfoRepo struct {
	db *Database
}

func (p *BanInfoRepo) DeleteExpired(ctx context.Context) error {
	query := `
		DELETE FROM ban_info
		WHERE expires_at IS NOT NULL AND expires_at <= NOW()
	`
	_, err := p.db.ExecContext(ctx, query)
	return err
}

func (p *BanInfoRepo) GetBanInfoByUserID(ctx context.Context, userID string) (*model.BanInfo, error) {
	var banInfo model.BanInfo
	query := `
		SELECT
			id, user_id, banned_by, reason, created_at, expires_at
		FROM ban_info
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT 1
	`
	err := p.db.GetContext(ctx, &banInfo, query, userID)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &banInfo, nil
}

func NewBanInfoRepo(db *Database) repo.BanInfoRepo {
	return &BanInfoRepo{db}
}
