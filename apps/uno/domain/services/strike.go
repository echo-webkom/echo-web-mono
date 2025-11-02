package services

import (
	"context"

	"uno/domain/repo"
)

type StrikeService struct {
	dotRepo     repo.DotRepo
	banInforepo repo.BanInfoRepo
	userRepo    repo.UserRepo
}

func NewStrikeService(
	dotRepo repo.DotRepo,
	banInfoRepo repo.BanInfoRepo,
	userRepo repo.UserRepo,
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

func (s *StrikeService) GetUsersWithStrikes(ctx context.Context) ([]repo.UserWithStrikes, error) {
	return s.userRepo.GetUsersWithStrikes(ctx)
}

func (s *StrikeService) GetBannedUsers(ctx context.Context) ([]repo.UserWithBanInfo, error) {
	return s.userRepo.GetBannedUsers(ctx)
}

func (s *StrikeService) UserRepo() repo.UserRepo {
	return s.userRepo
}

func (s *StrikeService) DotRepo() repo.DotRepo {
	return s.dotRepo
}

func (s *StrikeService) BanInfoRepo() repo.BanInfoRepo {
	return s.banInforepo
}
