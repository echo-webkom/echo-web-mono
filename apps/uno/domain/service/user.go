package service

import (
	"context"
	"errors"
	"time"
	"uno/domain/model"
	"uno/domain/port"
)

var ErrFileStorageNotConfigured = errors.New("file storage not configured")

type UserService struct {
	userRepo           port.UserRepo
	profilePictureRepo port.ProfilePictureRepo
}

func NewUserService(
	userRepo port.UserRepo,
	profilePictureRepo port.ProfilePictureRepo,
) *UserService {
	return &UserService{
		userRepo:           userRepo,
		profilePictureRepo: profilePictureRepo,
	}
}

func (s *UserService) GetUserGroupIDs(ctx context.Context, feideID string) ([]string, error) {
	return s.userRepo.GetUserGroupIDs(ctx, feideID)
}

func (s *UserService) SearchUsersByName(ctx context.Context, query string, limit int) ([]model.User, error) {
	return s.userRepo.SearchUsersByName(ctx, query, limit)
}

func (s *UserService) GetAllUsers(ctx context.Context) ([]model.User, error) {
	return s.userRepo.GetAllUsers(ctx)
}

func (s *UserService) GetUserByID(ctx context.Context, userID string) (model.User, error) {
	return s.userRepo.GetUserByID(ctx, userID)
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
	if !user.HasImage {
		return nil
	}

	// Clear the image marker in the database
	if err = s.userRepo.UpdateUserImage(ctx, userID, false); err != nil {
		return err
	}

	return s.profilePictureRepo.DeleteProfilePicture(ctx, user.ID)
}

func (s *UserService) UploadProfileImage(ctx context.Context, userID string, profilePicture *model.ProfilePictureUpload) error {
	if s.profilePictureRepo == nil {
		return ErrFileStorageNotConfigured
	}

	// Validate that the uploaded file is an image and meets the size requirements
	if err := profilePicture.Validate(); err != nil {
		return err
	}

	// Check if the user exists
	user, err := s.userRepo.GetUserByID(ctx, userID)
	if err != nil {
		return err
	}

	// Upload the image to the file storage
	if err = s.profilePictureRepo.UploadProfilePicture(ctx, user.ID, profilePicture); err != nil {
		return err
	}

	// Mark that the user has a profile picture
	return s.userRepo.UpdateUserImage(ctx, userID, true)
}
