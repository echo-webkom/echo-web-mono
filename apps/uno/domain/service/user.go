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

func (s *UserService) GetProfilePicture(ctx context.Context, userID string, size int) (*model.ProfilePicture, error) {
	// This is to silently fail if the file storage is not configured, i.e in testing environments.
	// The client will just get a 404 when trying to fetch the image, which is fine.
	if s.profilePictureRepo == nil {
		return nil, ErrFileStorageNotConfigured
	}
	return s.profilePictureRepo.GetProfilePicture(ctx, userID, size)
}

func (s *UserService) DeleteUserImage(ctx context.Context, userID string) error {
	if s.profilePictureRepo == nil {
		return ErrFileStorageNotConfigured
	}

	// Check if the user exists
	user, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		return err
	}

	// If the user doesn't have an image, there's nothing to delete
	if user.Image == nil {
		return nil
	}

	// Remove the image URL from the database
	err = s.userRepo.UpdateUserImageURL(ctx, userID, nil)
	if err != nil {
		return err
	}

	return s.profilePictureRepo.DeleteProfilePicture(ctx, user.ID)
}

func (s *UserService) UploadProfileImage(ctx context.Context, userID string, profilePicture *model.ProfilePictureUpload) (string, error) {
	if s.profilePictureRepo == nil {
		return "", ErrFileStorageNotConfigured
	}

	// Validate that the uploaded file is an image and meets the size requirements
	err := profilePicture.Validate()
	if err != nil {
		return "", err
	}

	// Check if the user exists
	user, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		return "", err
	}

	// Upload the image to the file storage
	err = s.profilePictureRepo.UploadProfilePicture(ctx, user.ID, profilePicture)
	if err != nil {
		return "", err
	}

	// Store the image URL in the database, with a timestamp to prevent caching issues
	imageURL := fmt.Sprintf("%s/users/%s/image?t=%d", s.apiURL, userID, time.Now().UnixMilli())
	err = s.userRepo.UpdateUserImageURL(ctx, userID, &imageURL)
	if err != nil {
		return "", err
	}

	// Return the image URL so the client can display the uploaded image
	return imageURL, nil
}
