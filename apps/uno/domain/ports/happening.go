package ports

import (
	"context"
	"time"
	"uno/domain/model"
)

type HappeningRegistration struct {
	UserID           string                   `json:"userId"`
	HappeningID      string                   `json:"happeningId"`
	Status           model.RegistrationStatus `json:"status"`
	UnregisterReason *string                  `json:"unregisterReason"`
	CreatedAt        time.Time                `json:"createdAt"`
	PrevStatus       *string                  `json:"prevStatus"`
	ChangedAt        *time.Time               `json:"changedAt"`
	ChangedBy        *string                  `json:"changedBy"`
	UserName         *string                  `json:"userName"`
	UserImage        *string                  `json:"userImage"`
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
