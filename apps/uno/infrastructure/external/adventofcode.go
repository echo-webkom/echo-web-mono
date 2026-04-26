package external

import (
	"context"
	"fmt"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
	"uno/pkg/adventofcode"

	"github.com/redis/go-redis/v9"
)

const (
	aocCacheTTL = 15 * time.Minute
)

type AdventOfCodeClient struct {
	aoc              *adventofcode.Client
	logger           port.Logger
	leaderboardCache port.Cache[model.AdventOfCodeLeaderboard]
}

func NewAdventOfCodeClient(aoc *adventofcode.Client, logger port.Logger, redisClient *redis.Client) port.AdventOfCodeRepo {
	return &AdventOfCodeClient{
		aoc:              aoc,
		logger:           logger,
		leaderboardCache: cache.NewCache[model.AdventOfCodeLeaderboard](redisClient, "aoc:leaderboard", logger),
	}
}

func (c *AdventOfCodeClient) GetAdventOfCodeLeaderboard(ctx context.Context, year int, leaderboardID string) (model.AdventOfCodeLeaderboard, error) {
	key := fmt.Sprintf("leaderboard-%d", year)
	if leaderboard, ok := c.leaderboardCache.Get(key); ok {
		return leaderboard, nil
	}

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

	c.leaderboardCache.Set(key, leaderboard, aocCacheTTL)
	return leaderboard, nil
}
