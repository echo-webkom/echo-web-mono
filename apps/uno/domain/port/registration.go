package port

import (
	"context"
	"uno/domain/model"
)

type RegistrationRepo interface {
	GetByUserID(ctx context.Context, userID string) ([]model.RegistrationWithHappening, error)
	GetByUserAndHappening(ctx context.Context, userID, happeningID string) (*model.Registration, error)
	CreateRegistration(
		ctx context.Context,
		userID, happeningID string,
		spotRanges []model.SpotRange,
		hostGroups []string,
		canSkipSpotRange bool,
	) (*model.Registration, bool, error)
	InsertAnswers(ctx context.Context, userID, happeningID string, questions []model.QuestionAnswer) error
}
