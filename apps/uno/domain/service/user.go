package service

import (
	"context"
	"time"
	"uno/domain/model"
	"uno/domain/port"
)

type UserService struct {
	userRepo port.UserRepo
}

func NewUserService(
	userRepo port.UserRepo,
) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}

func (s *UserService) UserRepo() port.UserRepo {
	return s.userRepo
}

func (s *UserService) GetUsersWithBirthdayToday(ctx context.Context) ([]model.User, error) {
	norway, _ := time.LoadLocation("Europe/Oslo")
	return s.userRepo.GetUsersWithBirthday(ctx, time.Now().In(norway))
}

func (s *UserService) ResetUserYears(ctx context.Context) (int64, error) {
	return s.userRepo.ResetUserYears(ctx)
}
