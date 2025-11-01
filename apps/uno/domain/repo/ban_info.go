package repo

import (
	"context"
	"uno/domain/model"
)

type BanInfoRepo interface {
	DeleteExpired(ctx context.Context) error
	GetBanInfoByUserID(ctx context.Context, userID string) (*model.BanInfo, error)
}
