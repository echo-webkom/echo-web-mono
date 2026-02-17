package service

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
)

const (
	leaderboardID = "3293269"
)

type AdventOfCodeService struct {
	aoc port.AdventOfCodeRepo
}

func NewAdventOfCodeService(aoc port.AdventOfCodeRepo) *AdventOfCodeService {
	return &AdventOfCodeService{aoc: aoc}
}

func (s *AdventOfCodeService) GetAdventOfCodeLeaderboard(ctx context.Context, year int) (model.AdventOfCodeLeaderboard, error) {
	return s.aoc.GetAdventOfCodeLeaderboard(ctx, year, leaderboardID)
}
