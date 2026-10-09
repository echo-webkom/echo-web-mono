package port

import (
	"context"
	"uno/domain/model"
)

type AchievementRepo interface{
	GetAchievements(ctx context.Context , userID string) (model.Achievement, error)
}