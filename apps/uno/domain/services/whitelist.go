package services

import "uno/domain/repo"

type WhitelistService struct {
	whitelistRepo repo.WhitelistRepo
}

func NewWhitelistService(whitelistRepo repo.WhitelistRepo) *WhitelistService {
	return &WhitelistService{whitelistRepo: whitelistRepo}
}

func (s *WhitelistService) Queries() repo.WhitelistRepo {
	return s.whitelistRepo
}
