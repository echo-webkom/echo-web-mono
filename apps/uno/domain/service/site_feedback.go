package service

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
)

type SiteFeedbackService struct {
	siteFeedbackRepo port.SiteFeedbackRepo
}

func NewSiteFeedbackService(siteFeedbackRepo port.SiteFeedbackRepo) *SiteFeedbackService {
	return &SiteFeedbackService{siteFeedbackRepo: siteFeedbackRepo}
}

func (s *SiteFeedbackService) GetAllSiteFeedbacks(ctx context.Context) ([]model.SiteFeedback, error) {
	return s.siteFeedbackRepo.GetAllSiteFeedbacks(ctx)
}

func (s *SiteFeedbackService) GetSiteFeedbackByID(ctx context.Context, feedbackID string) (model.SiteFeedback, error) {
	return s.siteFeedbackRepo.GetSiteFeedbackByID(ctx, feedbackID)
}

func (s *SiteFeedbackService) CreateSiteFeedback(ctx context.Context, feedback model.NewSiteFeedback) (model.SiteFeedback, error) {
	return s.siteFeedbackRepo.CreateSiteFeedback(ctx, feedback)
}

func (s *SiteFeedbackService) MarkSiteFeedbackAsRead(ctx context.Context, feedbackID string) error {
	return s.siteFeedbackRepo.MarkSiteFeedbackAsRead(ctx, feedbackID)
}
