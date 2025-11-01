package services

import (
	"uno/domain/repo"
)

type HappeningService struct {
	happeningRepo repo.HappeningRepo
}

func NewHappeningService(happeningRepo repo.HappeningRepo) *HappeningService {
	return &HappeningService{
		happeningRepo: happeningRepo,
	}
}

func (hs *HappeningService) Queries() repo.HappeningRepo {
	return hs.happeningRepo
}
