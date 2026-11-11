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

	// The title must match the title of the trophy in Sanity.
	progress := []struct {
		title string
		count int
	}{
		{title: "bedpres", count: userStats.BedpresCount},
		{title: "gokart", count: userStats.GokartCount},
	}

	userTrophies := []model.UserTrophy{}
	for _, p := range progress {
		if userTrophy, ok := getUserTrophy(trophies, p.title, p.count); ok {
			userTrophies = append(userTrophies, userTrophy)
		} else {
			t.logger.Info(ctx, "no trophy for user", "user_id", userID, "trophy", p.title, "count", p.count)
		}
	}

	return userTrophies, nil
}

// getUserTrophy returns the highest level of the trophy with the given title that the user has reached.
// It returns false if the trophy is not defined in Sanity or no level has been reached yet.
func getUserTrophy(trophies []model.Trophy, title string, count int) (model.UserTrophy, bool) {
	var trophy *model.Trophy
	for i := range trophies {
		if trophies[i].Title == title {
			trophy = &trophies[i]
			break
		}
	}
	if trophy == nil {
		return model.UserTrophy{}, false
	}

	var currentLevel *model.TrophyLevel
	for i := range trophy.TrophyLevels {
		level := &trophy.TrophyLevels[i]
		if level.Threshold <= count &&
			(currentLevel == nil || level.Threshold > currentLevel.Threshold) {
			currentLevel = level
		}
	}

	if currentLevel == nil {
		return model.UserTrophy{}, false
	}

	return model.UserTrophy{Trophy: *trophy, Progress: count, CurrentLevel: *currentLevel}, true
}
