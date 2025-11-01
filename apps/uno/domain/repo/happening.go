package repo

import (
	"context"
	"uno/domain/model"
)

type HappeningRepo interface {
	GetAllHappenings(ctx context.Context) ([]model.Happening, error)
	GetHappeningById(ctx context.Context, id string) (model.Happening, error)
	GetHappeningRegistrations(ctx context.Context, happeningID string) ([]model.Registration, error)
	GetHappeningSpotRanges(ctx context.Context, happeningID string) ([]model.SpotRange, error)
	GetHappeningQuestions(ctx context.Context, happeningID string) ([]model.Question, error)
}
