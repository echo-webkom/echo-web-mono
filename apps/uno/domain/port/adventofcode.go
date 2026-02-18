package port

import (
	"context"
	"uno/domain/model"
)

type AdventOfCodeRepo interface {
	GetAdventOfCodeLeaderboard(ctx context.Context, year int, leaderboardID string) (model.AdventOfCodeLeaderboard, error)
}
