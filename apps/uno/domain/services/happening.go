package services

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type HappeningService struct {
	happeningRepo    repo.HappeningRepo
	registrationRepo repo.RegistrationRepo
	spotRangeRepo    repo.SpotRangeRepo
	questionRepo     repo.QuestionRepo
}

func NewHappeningService(happeningRepo repo.HappeningRepo, registrationRepo repo.RegistrationRepo, spotRangeRepo repo.SpotRangeRepo, questionRepo repo.QuestionRepo) *HappeningService {
	return &HappeningService{
		happeningRepo: happeningRepo,
	}
}

func (hs *HappeningService) GetAllHappenings(ctx context.Context) ([]model.Happening, error) {
	return hs.happeningRepo.GetAllHappenings(ctx)
}

func (hs HappeningService) GetHappeningRegistrations(ctx context.Context, id string) ([]model.Registration, error) {
	return hs.registrationRepo.GetRegistrationsByHappeningId(ctx, id)
}

func (hs HappeningService) GetHappeningById(context context.Context, id string) (model.Happening, error) {
	return hs.happeningRepo.GetHappeningById(context, id)
}

func (hs HappeningService) GetHappeningSpotRanges(ctx context.Context, d string) ([]model.SpotRange, error) {
	return hs.spotRangeRepo.GetSpotRangesByHappeningId(ctx, d)
}

func (hs HappeningService) GetHappeningQuestions(ctx context.Context, id string) ([]model.Question, error) {
	return hs.questionRepo.GetQuestionsByHappeningId(ctx, id)
}
