package port

import (
	"context"
	"time"
	"uno/domain/model"
)

type SpotAvailabilityFunc func(
	spotRanges []model.SpotRange,
	registrations []model.Registration,
	usersByID map[string]*model.User,
	membershipsByUserID map[string][]string,
	hostGroups []string,
	user *model.User,
	canSkip bool,
) bool

type RegistrationRepo interface {
	GetByUserID(ctx context.Context, userID string) ([]model.RegistrationWithHappening, error)
	GetByUserAndHappening(ctx context.Context, userID, happeningID string) (*model.Registration, error)
	CreateRegistration(
		ctx context.Context,
		userID, happeningID string,
		spotRanges []model.SpotRange,
		hostGroups []string,
		canSkipSpotRange bool,
		spotAvailable SpotAvailabilityFunc,
	) (*model.Registration, bool, error)
	InsertAnswers(ctx context.Context, userID, happeningID string, questions []model.QuestionAnswer) error
	DeleteAnswersByUserAndHappening(ctx context.Context, userID, happeningID string) error
	UpdateRegistrationStatus(ctx context.Context, userID, happeningID string, status model.RegistrationStatus, prevStatus *string, changedBy *string, changedAt *time.Time, unregisterReason *string) error
	DeleteRegistrationsByHappeningID(ctx context.Context, happeningID string) error
}
