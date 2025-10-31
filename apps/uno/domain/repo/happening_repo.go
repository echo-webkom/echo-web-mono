package repo

import (
	"context"
	"uno/domain/model"
)

type HappeningRepo interface {
	GetAllHappenings(ctx context.Context) ([]model.Happening, error)
	GetHappeningById(ctx context.Context, id string) (model.Happening, error)
}
