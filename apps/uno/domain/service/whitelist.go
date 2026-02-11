package service

import "uno/domain/port"

type WhitelistService struct {
	whitelistRepo port.WhitelistRepo
}

func NewWhitelistService(whitelistRepo port.WhitelistRepo) *WhitelistService {
	return &WhitelistService{whitelistRepo: whitelistRepo}
}

func (s *WhitelistService) WhitelistRepo() port.WhitelistRepo {
	return s.whitelistRepo
}
