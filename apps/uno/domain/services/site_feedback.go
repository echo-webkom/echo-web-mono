package services

import (
	"uno/domain/ports"
)

type SiteFeedbackService struct {
	siteFeedbackRepo ports.SiteFeedbackRepo
}

func NewSiteFeedbackService(siteFeedbackRepo ports.SiteFeedbackRepo) *SiteFeedbackService {
	return &SiteFeedbackService{siteFeedbackRepo: siteFeedbackRepo}
}

func (s *SiteFeedbackService) Queries() ports.SiteFeedbackRepo {
	return s.siteFeedbackRepo
}

func (s *SiteFeedbackService) SiteFeedbackRepo() ports.SiteFeedbackRepo {
	return s.siteFeedbackRepo
}
