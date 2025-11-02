package services

import (
	"context"
	"time"
	"uno/domain/model"
	"uno/domain/repo"
)

type UserService struct {
	userRepo repo.UserRepo
}

func NewUserService(
	userRepo repo.UserRepo,
) *UserService {
	return &UserService{
		userRepo: userRepo,
	}
}

func (s *UserService) UserRepo() repo.UserRepo {
	return s.userRepo
}

func (s *UserService) GetUsersWithBirthdayToday(ctx context.Context) ([]model.User, error) {
	norway, _ := time.LoadLocation("Europe/Oslo")
	return s.userRepo.GetUsersWithBirthday(ctx, time.Now().In(norway))
}
