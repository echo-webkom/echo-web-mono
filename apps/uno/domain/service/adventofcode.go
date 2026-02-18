package service

import (
	"context"
	"fmt"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
)

const (
	leaderboardID = "3293269"
	aocCacheTTL   = 15 * time.Minute
)

type AdventOfCodeService struct {
	aoc              port.AdventOfCodeRepo
	leaderboardCache port.Cache[model.AdventOfCodeLeaderboard]
}

func NewAdventOfCodeService(aoc port.AdventOfCodeRepo) *AdventOfCodeService {
	return &AdventOfCodeService{
		aoc:              aoc,
		leaderboardCache: cache.NewInMemoryCache[model.AdventOfCodeLeaderboard](),
	}
}

func (s *AdventOfCodeService) GetAdventOfCodeLeaderboard(ctx context.Context, year int) (model.AdventOfCodeLeaderboard, error) {
	key := fmt.Sprintf("leaderboard-%d", year)

	if leaderboard, ok := s.leaderboardCache.Get(key); ok {
		return leaderboard, nil
	}

	leaderboard, err := s.aoc.GetAdventOfCodeLeaderboard(ctx, year, leaderboardID)
	if err != nil {
		return model.AdventOfCodeLeaderboard{}, err
	}

	s.leaderboardCache.Set(key, leaderboard, aocCacheTTL)
	return leaderboard, nil
}
