package service

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
)

type AchievementService struct {
	achievementRepo port.AchievementRepo
}

func NewAchievementService(achievementRepo port.AchievementRepo) *AchievementService {
	return &AchievementService{
		achievementRepo: achievementRepo,
	}
}

func (as *AchievementService) GetAchievements(ctx context.Context, userID string) (model.Achievement, error){
	return as.achievementRepo.GetAchievements(ctx, userID)
}