package service

import (
	"context"
	"errors"
	"uno/domain/model"
	"uno/domain/port"
)

type TrophyService struct {
	trophyRepo       port.TrophyRepo
	userStatsRepo    port.UserStatsRepo
	logger           port.Logger
}

func NewTrophyService(
	trophyRepo port.TrophyRepo,
	userStatsRepo port.UserStatsRepo,
	logger port.Logger,
) *TrophyService {
	return &TrophyService{
		trophyRepo: trophyRepo,
		userStatsRepo: userStatsRepo,
		logger: logger,
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

	bedpressThrophy, err := getUserBedpresTrophy(trophies, userStats.BedpresCount)
	if err != nil {
		t.logger.Error(ctx, "failed to resolve bedpres trophy", "error", err, "user_id", userID)
		return nil, err
	}

	return []model.UserTrophy{bedpressThrophy}, nil
}

func getUserBedpresTrophy(trophies []model.Trophy, bedpresCount int) (model.UserTrophy, error) {

	if bedpresCount < 0 {
		return model.UserTrophy{}, errors.New("bedpres count cannot be negative")
	}

	var bedpresTrophy *model.Trophy
	for i := range trophies {
		if trophies[i].Title == "bedpres" {
			bedpresTrophy = &trophies[i]
			break
		}
	}
	if bedpresTrophy == nil {
		return model.UserTrophy{}, errors.New("bedpres trophy not found")
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
		return model.UserTrophy{}, errors.New("no trophy level reached")
	}

	return model.UserTrophy{Trophy: *bedpresTrophy, Progress: bedpresCount, CurrentLevel: *currentLevel}, nil
}