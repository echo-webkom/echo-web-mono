package services

import (
	"uno/domain/repo"
)

type SiteFeedbackService struct {
	siteFeedbackRepo repo.SiteFeedbackRepo
}

func NewSiteFeedbackService(siteFeedbackRepo repo.SiteFeedbackRepo) *SiteFeedbackService {
	return &SiteFeedbackService{siteFeedbackRepo: siteFeedbackRepo}
}

func (s *SiteFeedbackService) Queries() repo.SiteFeedbackRepo {
	return s.siteFeedbackRepo
}

func (s *SiteFeedbackService) SiteFeedbackRepo() repo.SiteFeedbackRepo {
	return s.siteFeedbackRepo
}
