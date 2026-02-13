package port

import (
	"context"
	"uno/domain/model"
)

type RegistrationRepo interface {
	GetByUserAndHappening(ctx context.Context, userID, happeningID string) (*model.Registration, error)
	CreateRegistration(
		ctx context.Context,
		userID string,
		happening model.Happening,
		spotRanges []model.SpotRange,
		hostGroups []string,
		canSkipSpotRange bool,
	) (*model.Registration, bool, error)
	InsertAnswers(ctx context.Context, userID, happeningID string, questions []model.QuestionAnswer) error
}
