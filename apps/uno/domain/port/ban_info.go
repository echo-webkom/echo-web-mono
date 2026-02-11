package port

import (
	"context"
	"uno/domain/model"
)

type BanInfoRepo interface {
	DeleteExpired(ctx context.Context) error
	GetBanInfoByUserID(ctx context.Context, userID string) (*model.ModBanInfo, error)
	CreateBan(ctx context.Context, ban model.NewBanInfo) (model.ModBanInfo, error)
}
