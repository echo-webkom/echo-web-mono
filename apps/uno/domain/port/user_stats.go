package port

import (
	"context"
	"uno/domain/model"
)

type UserStatsRepo interface {
	GetUserStats(ctx context.Context, userID string) (model.UserStats, error)
}