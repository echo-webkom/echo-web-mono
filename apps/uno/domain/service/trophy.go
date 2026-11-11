package service

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
)

type TrophyService struct {
	trophyRepo    port.TrophyRepo
	userStatsRepo port.UserStatsRepo
	logger        port.Logger
}

func NewTrophyService(
	trophyRepo port.TrophyRepo,
	userStatsRepo port.UserStatsRepo,
	logger port.Logger,
) *TrophyService {
	return &TrophyService{
		trophyRepo:    trophyRepo,
		userStatsRepo: userStatsRepo,
		logger:        logger,
	}
}

func (t *TrophyService) GetUserTrophies(ctx context.Context, userID string) ([]model.UserTrophy, error) {
	trophies, err := t.trophyRepo.GetAllTrophies(ctx)
	if err != nil {
		t.logger.Error(ctx, "failed to get trophy definitions", "error", err, "user_id", userID)
		return nil, err
	}

	userStats, err := t.userStatsRepo.GetUserStats(ctx, userID)
	if err != nil {
		t.logger.Error(ctx, "failed to get user stats for trophies", "error", err, "user_id", userID)
		return nil, err
	}

	userTrophies := []model.UserTrophy{}

	if bedpresTrophy, ok := getUserBedpresTrophy(trophies, userStats.BedpresCount); ok {
		userTrophies = append(userTrophies, bedpresTrophy)
	} else {
		t.logger.Info(ctx, "no bedpres trophy for user", "user_id", userID, "bedpres_count", userStats.BedpresCount)
	}

	return userTrophies, nil
}

func getUserBedpresTrophy(trophies []model.Trophy, bedpresCount int) (model.UserTrophy, bool) {
	var bedpresTrophy *model.Trophy
	for i := range trophies {
		if trophies[i].Title == "bedpres" {
			bedpresTrophy = &trophies[i]
			break
		}
	}
	if bedpresTrophy == nil {
		return model.UserTrophy{}, false
	}

	var currentLevel *model.TrophyLevel
	for i := range bedpresTrophy.TrophyLevels {
		level := &bedpresTrophy.TrophyLevels[i]
		if level.Threshold <= bedpresCount &&
			(currentLevel == nil || level.Threshold > currentLevel.Threshold) {
			currentLevel = level
		}
	}

	if currentLevel == nil {
		return model.UserTrophy{}, false
	}

	return model.UserTrophy{Trophy: *bedpresTrophy, Progress: bedpresCount, CurrentLevel: *currentLevel}, true
}
