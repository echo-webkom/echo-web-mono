package services

import (
	"context"
	"time"
	"uno/domain/model"
	"uno/domain/ports"
)

type UserService struct {
	userRepo ports.UserRepo
}

func NewUserService(
	userRepo ports.UserRepo,
) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}

func (s *UserService) UserRepo() ports.UserRepo {
	return s.userRepo
}

func (s *UserService) GetUsersWithBirthdayToday(ctx context.Context) ([]model.User, error) {
	norway, _ := time.LoadLocation("Europe/Oslo")
	return s.userRepo.GetUsersWithBirthday(ctx, time.Now().In(norway))
}
