package service

import (
	"context"
	"errors"
	"fmt"
	"time"
	"uno/domain/model"
	"uno/domain/port"
)

var ErrFileStorageNotConfigured = errors.New("file storage not configured")

type UserService struct {
	apiURL             string
	userRepo           port.UserRepo
	profilePictureRepo port.ProfilePictureRepo
}

func NewUserService(
	apiURL string,
	userRepo port.UserRepo,
	profilePictureRepo port.ProfilePictureRepo,
) *UserService {
	return &UserService{
		apiURL:             apiURL,
		userRepo:           userRepo,
		profilePictureRepo: profilePictureRepo,
	}
}

func (s *UserService) UserRepo() port.UserRepo {
	return s.userRepo
}

func (s *UserService) ProfilePictureRepo() port.ProfilePictureRepo {
	return s.profilePictureRepo
}

func (s *UserService) GetUsersWithBirthdayToday(ctx context.Context) ([]model.User, error) {
	norway, _ := time.LoadLocation("Europe/Oslo")
	return s.userRepo.GetUsersWithBirthday(ctx, time.Now().In(norway))
}

func (s *UserService) ResetUserYears(ctx context.Context) (int64, error) {
	return s.userRepo.ResetUserYears(ctx)
}

func (s *UserService) GetProfilePicture(ctx context.Context, userID string) (*model.ProfilePicture, error) {
	if s.profilePictureRepo == nil {
		return nil, ErrFileStorageNotConfigured
	}
	return s.profilePictureRepo.GetProfilePicture(ctx, userID)
}

func (s *UserService) DeleteUserImage(ctx context.Context, userID string) error {
	if s.profilePictureRepo == nil {
		return ErrFileStorageNotConfigured
	}

	user, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		return err
	}

	if user.Image == nil {
		return nil
	}

	return s.profilePictureRepo.DeleteProfilePicture(ctx, user.ID)
}

func (s *UserService) UploadProfileImage(ctx context.Context, userID string, profilePicture *model.ProfilePictureUpload) (string, error) {
	if s.profilePictureRepo == nil {
		return "", ErrFileStorageNotConfigured
	}

	err := profilePicture.Validate()
	if err != nil {
		return "", err
	}

	user, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		return "", err
	}

	err = s.profilePictureRepo.UploadProfilePicture(ctx, user.ID, profilePicture)
	if err != nil {
		return "", err
	}

	imageURL := fmt.Sprintf("%s/users/%s/image", s.apiURL, userID)
	err = s.userRepo.UpdateUserImageURL(ctx, userID, &imageURL)
	if err != nil {
		return "", err
	}

	return imageURL, nil
}
