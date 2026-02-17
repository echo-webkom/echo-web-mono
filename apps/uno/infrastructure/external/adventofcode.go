package external

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/adventofcode"
)

type AdventOfCodeClient struct {
	logger port.Logger
	aoc    *adventofcode.Client
}

func NewAdventOfCodeClient(logger port.Logger, aoc *adventofcode.Client) port.AdventOfCodeRepo {
	return &AdventOfCodeClient{
		logger: logger,
		aoc:    aoc,
	}
}

func (c *AdventOfCodeClient) GetAdventOfCodeLeaderboard(ctx context.Context, year int, leaderboardID string) (model.AdventOfCodeLeaderboard, error) {
	aocLeaderboard, err := c.aoc.GetLeaderboard(year, leaderboardID)
	if err != nil {
		c.logger.Error(ctx, "failed to fetch Advent of Code leaderboard", "err", err.Error())
		return model.AdventOfCodeLeaderboard{}, err
	}

	leaderboard := []model.AdventOfCodeMember{}
	for _, member := range aocLeaderboard.Members {
		days := make(map[string]model.AdventOfCodeDay)
		for k, v := range member.CompletionDayLevel {
			hasStar1 := v["1"] != nil
			hasStar2 := v["2"] != nil
			var star1Time, star2Time *int
			if hasStar1 {
				star1Time = &v["1"].GetStarTs
			}
			if hasStar2 {
				star2Time = &v["2"].GetStarTs
			}

			stars := 0
			if hasStar1 {
				stars++
			}
			if hasStar2 {
				stars++
			}

			days[k] = model.AdventOfCodeDay{
				Stars:     stars,
				Star1Time: star1Time,
				Star2Time: star2Time,
			}
		}

		m := model.AdventOfCodeMember{
			ID:         member.ID,
			Name:       member.Name,
			LocalScore: member.LocalScore,
			Days:       days,
		}

		leaderboard = append(leaderboard, m)
	}

	return leaderboard, nil
}
