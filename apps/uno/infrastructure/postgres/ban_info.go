package postgres

import (
	"context"
	"database/sql"
	"uno/domain/model"
	"uno/domain/ports"
)

type BanInfoRepo struct {
	db     *Database
	logger ports.Logger
}

func NewBanInfoRepo(db *Database, logger ports.Logger) ports.BanInfoRepo {
	return &BanInfoRepo{db: db, logger: logger}
}

func (p *BanInfoRepo) DeleteExpired(ctx context.Context) error {
	query := `--sql
		DELETE FROM ban_info
		WHERE expires_at IS NOT NULL AND expires_at <= NOW()
	`
	_, err := p.db.ExecContext(ctx, query)
	return err
}

func (p *BanInfoRepo) GetBanInfoByUserID(ctx context.Context, userID string) (*model.BanInfo, error) {
	var banInfo model.BanInfo
	query := `--sql
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

func (p *BanInfoRepo) CreateBan(ctx context.Context, ban model.BanInfo) (model.BanInfo, error) {
	query := `--sql
		INSERT INTO ban_info (user_id, banned_by, reason, expires_at)
		VALUES ($1, $2, $3, $4)
		RETURNING id, user_id, banned_by, reason, created_at, expires_at
	`
	var result model.BanInfo
	err := p.db.GetContext(ctx, &result, query, ban.UserID, ban.BannedBy, ban.Reason, ban.ExpiresAt)
	return result, err
}
