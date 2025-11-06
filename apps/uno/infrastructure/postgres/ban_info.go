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
	p.logger.Info(ctx, "deleting expired ban infos")

	query := `--sql
		DELETE FROM ban_info
		WHERE expires_at IS NOT NULL AND expires_at <= NOW()
	`
	_, err := p.db.ExecContext(ctx, query)
	if err != nil {
		p.logger.Error(ctx, "failed to delete expired ban infos",
			"error", err,
		)
		return err
	}
	return nil
}

func (p *BanInfoRepo) GetBanInfoByUserID(ctx context.Context, userID string) (*model.BanInfo, error) {
	p.logger.Info(ctx, "getting ban info by user ID",
		"user_id", userID,
	)

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
		p.logger.Error(ctx, "failed to get ban info by user ID",
			"error", err,
			"user_id", userID,
		)
		return nil, err
	}
	return &banInfo, nil
}

func (p *BanInfoRepo) CreateBan(ctx context.Context, ban model.BanInfo) (model.BanInfo, error) {
	p.logger.Info(ctx, "creating ban info",
		"user_id", ban.UserID,
		"banned_by", ban.BannedBy,
	)

	query := `--sql
		INSERT INTO ban_info (user_id, banned_by, reason, expires_at, created_at)
		VALUES ($1, $2, $3, $4, NOW())
		RETURNING id, user_id, banned_by, reason, created_at, expires_at
	`
	var result model.BanInfo
	err := p.db.GetContext(ctx, &result, query, ban.UserID, ban.BannedBy, ban.Reason, ban.ExpiresAt)
	if err != nil {
		p.logger.Error(ctx, "failed to create ban info",
			"error", err,
			"user_id", ban.UserID,
		)
		return model.BanInfo{}, err
	}
	return result, nil
}
