package ports

import (
	"context"
	"uno/domain/model"
)

type HappeningRegistration struct {
	model.Registration
	UserName  *string `db:"user_name" json:"userName"`
	UserImage *string `db:"user_image" json:"userImage"`
}

type GroupedRegistrationCount struct {
	HappeningID string `db:"happening_id" json:"happeningId"`
	Max         *int   `db:"max" json:"max"`
	Waiting     int    `db:"waiting" json:"waiting"`
	Registered  int    `db:"registered" json:"registered"`
}

type HappeningRepo interface {
	GetAllHappenings(ctx context.Context) ([]model.Happening, error)
	GetHappeningById(ctx context.Context, id string) (model.Happening, error)
	GetHappeningRegistrations(ctx context.Context, happeningID string) ([]HappeningRegistration, error)
	GetHappeningRegistrationCounts(ctx context.Context, happeningIDs []string) ([]GroupedRegistrationCount, error)
	GetHappeningSpotRanges(ctx context.Context, happeningID string) ([]model.SpotRange, error)
	GetHappeningQuestions(ctx context.Context, happeningID string) ([]model.Question, error)
	GetHappeningHostGroups(ctx context.Context, happeningID string) ([]string, error)
	CreateHappening(ctx context.Context, happening model.Happening) (model.Happening, error)
}
