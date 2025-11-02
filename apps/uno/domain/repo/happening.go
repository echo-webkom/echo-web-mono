package repo

import (
	"context"
	"uno/domain/model"
)

type HappeningRegistration struct {
	model.Registration
	UserName  *string `db:"user_name" json:"userName,omitempty"`
	UserImage *string `db:"user_image" json:"userImage,omitempty"`
}

type HappeningRepo interface {
	GetAllHappenings(ctx context.Context) ([]model.Happening, error)
	GetHappeningById(ctx context.Context, id string) (model.Happening, error)
	GetHappeningRegistrations(ctx context.Context, happeningID string) ([]HappeningRegistration, error)
	GetHappeningSpotRanges(ctx context.Context, happeningID string) ([]model.SpotRange, error)
	GetHappeningQuestions(ctx context.Context, happeningID string) ([]model.Question, error)
	GetHappeningHostGroups(ctx context.Context, happeningID string) ([]string, error)
	CreateHappening(ctx context.Context, happening model.Happening) (model.Happening, error)
}
