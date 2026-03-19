package port

import (
	"context"
	"uno/domain/model"
)

type HappeningRepo interface {
	GetAllHappenings(ctx context.Context) ([]model.Happening, error)
	GetHappeningById(ctx context.Context, id string) (model.Happening, error)
	GetHappeningRegistrations(ctx context.Context, happeningID string) ([]model.HappeningRegistration, error)
	GetHappeningRegistrationCounts(ctx context.Context, happeningIDs []string) ([]model.RegistrationCount, error)
	GetHappeningSpotRanges(ctx context.Context, happeningID string) ([]model.SpotRange, error)
	GetHappeningQuestions(ctx context.Context, happeningID string) ([]model.Question, error)
	GetHappeningHostGroups(ctx context.Context, happeningID string) ([]string, error)
	CreateHappening(ctx context.Context, happening model.Happening) (model.Happening, error)
	GetFullHappeningBySlug(ctx context.Context, slug string) (model.FullHappening, error)
	UpsertHappening(ctx context.Context, happening model.Happening) error
	DeleteHappening(ctx context.Context, id string) error
	ReplaceHappeningGroups(ctx context.Context, happeningID string, groupIDs []string) error
	ReplaceSpotRanges(ctx context.Context, happeningID string, spotRanges []model.SpotRange) error
	SyncQuestions(ctx context.Context, happeningID string, questions []model.Question) error
}
