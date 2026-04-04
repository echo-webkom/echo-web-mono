package service

import (
	"context"
	"uno/domain/model"
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

func (s *StrikeService) CleanupOldStrikes(ctx context.Context) (int64, error) {
	return s.dotRepo.CleanupOldStrikes(ctx)
}

func (s *StrikeService) GetUsersWithStrikeDetails(ctx context.Context) ([]model.UserWithStrikeDetails, error) {
	return s.userRepo.GetUsersWithStrikeDetails(ctx)
}

func (s *StrikeService) GetUserByID(ctx context.Context, userID string) (model.User, error) {
	return s.userRepo.GetUserByID(ctx, userID)
}

func (s *StrikeService) GetBanInfoByUserID(ctx context.Context, userID string) (*model.ModBanInfo, error) {
	return s.banInforepo.GetBanInfoByUserID(ctx, userID)
}

func (s *StrikeService) CreateBan(ctx context.Context, ban model.NewBanInfo) (model.ModBanInfo, error) {
	return s.banInforepo.CreateBan(ctx, ban)
}

func (s *StrikeService) DeleteDotsByUserID(ctx context.Context, userID string) error {
	return s.dotRepo.DeleteDotsByUserID(ctx, userID)
}

func (s *StrikeService) CreateDot(ctx context.Context, dot model.NewDot) (model.Dot, error) {
	return s.dotRepo.CreateDot(ctx, dot)
}

func (s *StrikeService) DeleteBanByUserID(ctx context.Context, userID string) error {
	return s.banInforepo.DeleteBanByUserID(ctx, userID)
}

func (s *StrikeService) DeleteDotByIDAndUserID(ctx context.Context, id int, userID string) error {
	return s.dotRepo.DeleteDotByIDAndUserID(ctx, id, userID)
}
