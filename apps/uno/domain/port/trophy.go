package port

import (
	"context"
	"uno/domain/model"
)

type TrophyRepo interface {
	GetAllTrophies(ctx context.Context) ([]model.Trophy, error)
}