package service

import (
	"context"
	"uno/domain/port"
)

type StrikeService struct {
	dotRepo     port.DotRepo
	banInforepo port.BanInfoRepo
	userRepo    port.UserRepo
}

func NewStrikeService(
	dotRepo port.DotRepo,
	banInfoRepo port.BanInfoRepo,
	userRepo port.UserRepo,
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

func (s *StrikeService) GetUsersWithStrikes(ctx context.Context) ([]port.UserWithStrikes, error) {
	return s.userRepo.GetUsersWithStrikes(ctx)
}

func (s *StrikeService) GetBannedUsers(ctx context.Context) ([]port.UserWithBanInfo, error) {
	return s.userRepo.GetBannedUsers(ctx)
}

func (s *StrikeService) UserRepo() port.UserRepo {
	return s.userRepo
}

func (s *StrikeService) DotRepo() port.DotRepo {
	return s.dotRepo
}

func (s *StrikeService) BanInfoRepo() port.BanInfoRepo {
	return s.banInforepo
}
