package service

import "uno/domain/port"

type SiteFeedbackService struct {
	siteFeedbackRepo port.SiteFeedbackRepo
}

func NewSiteFeedbackService(siteFeedbackRepo port.SiteFeedbackRepo) *SiteFeedbackService {
	return &SiteFeedbackService{siteFeedbackRepo: siteFeedbackRepo}
}

func (s *SiteFeedbackService) SiteFeedbackRepo() port.SiteFeedbackRepo {
	return s.siteFeedbackRepo
}
