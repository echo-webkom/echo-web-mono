package service

import (
	"context"
	"uno/domain/ports"
)

type StrikeService struct {
	dotRepo     ports.DotRepo
	banInforepo ports.BanInfoRepo
	userRepo    ports.UserRepo
}

func NewStrikeService(
	dotRepo ports.DotRepo,
	banInfoRepo ports.BanInfoRepo,
	userRepo ports.UserRepo,
) *StrikeService {
	return &StrikeService{
		dotRepo:     dotRepo,
		banInforepo: banInfoRepo,
		userRepo:    userRepo,
	}
}

func (s *StrikeService) UnbanUsersWithExpiredStrikes(ctx context.Context) error {
	var err error
	if err = s.dotRepo.DeleteExpired(ctx); err != nil {
		return err
	}
	if err = s.banInforepo.DeleteExpired(ctx); err != nil {
		return err
	}
	return nil

}

func (s *StrikeService) GetUsersWithStrikes(ctx context.Context) ([]ports.UserWithStrikes, error) {
	return s.userRepo.GetUsersWithStrikes(ctx)
}

func (s *StrikeService) GetBannedUsers(ctx context.Context) ([]ports.UserWithBanInfo, error) {
	return s.userRepo.GetBannedUsers(ctx)
}

func (s *StrikeService) UserRepo() ports.UserRepo {
	return s.userRepo
}

func (s *StrikeService) DotRepo() ports.DotRepo {
	return s.dotRepo
}

func (s *StrikeService) BanInfoRepo() ports.BanInfoRepo {
	return s.banInforepo
}
