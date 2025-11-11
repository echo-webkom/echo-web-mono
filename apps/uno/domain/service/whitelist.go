package service

import "uno/domain/ports"

type WhitelistService struct {
	whitelistRepo ports.WhitelistRepo
}

func NewWhitelistService(whitelistRepo ports.WhitelistRepo) *WhitelistService {
	return &WhitelistService{whitelistRepo: whitelistRepo}
}

func (s *WhitelistService) WhitelistRepo() ports.WhitelistRepo {
	return s.whitelistRepo
}
