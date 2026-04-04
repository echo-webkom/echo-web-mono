package service

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
)

type WhitelistService struct {
	whitelistRepo port.WhitelistRepo
}

func NewWhitelistService(whitelistRepo port.WhitelistRepo) *WhitelistService {
	return &WhitelistService{whitelistRepo: whitelistRepo}
}

func (s *WhitelistService) GetWhitelist(ctx context.Context) ([]model.Whitelist, error) {
	return s.whitelistRepo.GetWhitelist(ctx)
}

func (s *WhitelistService) GetWhitelistByEmail(ctx context.Context, email string) (model.Whitelist, error) {
	return s.whitelistRepo.GetWhitelistByEmail(ctx, email)
}

func (s *WhitelistService) UpsertWhitelist(ctx context.Context, whitelist model.NewWhitelist) (model.Whitelist, error) {
	return s.whitelistRepo.UpsertWhitelist(ctx, whitelist)
}

func (s *WhitelistService) DeleteWhitelistByEmail(ctx context.Context, email string) error {
	return s.whitelistRepo.DeleteWhitelistByEmail(ctx, email)
}
