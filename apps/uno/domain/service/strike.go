package service

import (
	"context"
	"errors"
	"time"
	"uno/domain/model"
	"uno/domain/port"
)

var (
	ErrUserNotFound      = errors.New("user not found")
	ErrUserAlreadyBanned = errors.New("user is already banned")
)

type AddStrikeOptions struct {
	Count               int
	Reason              string
	StrikedBy           string
	StrikeExpiresMonths int
	BanExpiresMonths    int
}

type AddStrikeResult struct {
	IsBanned bool
}

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

func (s *StrikeService) GetUserWithStrikeDetailsByID(context context.Context, userID string) (*model.UserWithStrikeDetails, error) {
	return s.userRepo.GetUserWithStrikeDetailsByID(context, userID)
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

func (s *StrikeService) AddStrike(ctx context.Context, userID string, opts AddStrikeOptions) (AddStrikeResult, error) {
	if _, err := s.userRepo.GetUserByID(ctx, userID); err != nil {
		return AddStrikeResult{}, ErrUserNotFound
	}

	banInfo, err := s.banInforepo.GetBanInfoByUserID(ctx, userID)
	if err != nil {
		return AddStrikeResult{}, err
	}
	if banInfo != nil {
		return AddStrikeResult{}, ErrUserAlreadyBanned
	}

	userDetails, err := s.userRepo.GetUserWithStrikeDetailsByID(ctx, userID)
	if err != nil {
		return AddStrikeResult{}, err
	}

	previousStrikes := 0
	if userDetails != nil {
		for _, dot := range userDetails.Dots {
			previousStrikes += dot.Count
		}
	}

	shouldBeBanned := previousStrikes+opts.Count >= 5
	overflowStrikes := previousStrikes + opts.Count - 5

	if shouldBeBanned {
		if _, err = s.banInforepo.CreateBan(ctx, model.NewBanInfo{
			UserID:    userID,
			Reason:    opts.Reason,
			BannedBy:  opts.StrikedBy,
			ExpiresAt: time.Now().AddDate(0, opts.BanExpiresMonths, 0),
		}); err != nil {
			return AddStrikeResult{}, err
		}

		if err = s.dotRepo.DeleteDotsByUserID(ctx, userID); err != nil {
			return AddStrikeResult{}, err
		}

		if overflowStrikes > 0 {
			if _, err = s.dotRepo.CreateDot(ctx, model.NewDot{
				Count:     overflowStrikes,
				Reason:    opts.Reason,
				UserID:    userID,
				StrikedBy: opts.StrikedBy,
				ExpiresAt: time.Now().AddDate(0, opts.StrikeExpiresMonths, 0),
			}); err != nil {
				return AddStrikeResult{}, err
			}
		}

		return AddStrikeResult{IsBanned: true}, nil
	}

	if _, err = s.dotRepo.CreateDot(ctx, model.NewDot{
		Count:     opts.Count,
		Reason:    opts.Reason,
		UserID:    userID,
		StrikedBy: opts.StrikedBy,
		ExpiresAt: time.Now().AddDate(0, opts.StrikeExpiresMonths, 0),
	}); err != nil {
		return AddStrikeResult{}, err
	}

	return AddStrikeResult{IsBanned: false}, nil
}
