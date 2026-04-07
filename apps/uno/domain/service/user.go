package service

import (
	"context"
	"errors"
	"time"
	"uno/domain/model"
	"uno/domain/port"
)

var (
	ErrFileStorageNotConfigured = errors.New("file storage not configured")
	ErrInvalidEmail             = errors.New("invalid email format")
	ErrInvalidYear              = errors.New("year must be between 1 and 5")
	ErrDegreeNotFound           = errors.New("degree not found")
)

type UserService struct {
	userRepo           port.UserRepo
	profilePictureRepo port.ProfilePictureRepo
	groupRepo          port.GroupRepo
	degreeRepo         port.DegreeRepo
}

func NewUserService(
	userRepo port.UserRepo,
	profilePictureRepo port.ProfilePictureRepo,
	groupRepo port.GroupRepo,
	degreeRepo port.DegreeRepo,
) *UserService {
	return &UserService{
		userRepo:           userRepo,
		profilePictureRepo: profilePictureRepo,
		groupRepo:          groupRepo,
		degreeRepo:         degreeRepo,
	}
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

func (s *UserService) GetUserByFeideID(ctx context.Context, feideID string) (model.User, error) {
	return s.userRepo.GetUserByFeideID(ctx, feideID)
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

func (s *UserService) UpdateUser(ctx context.Context, userID string, params port.UpdateUserParams) (model.User, error) {
	// Validate alternative email if provided
	if params.AlternativeEmail.IsSome() {
		email := params.AlternativeEmail.Value()
		if email != nil {
			_, err := model.NewEmail(*email)
			if err != nil {
				return model.User{}, ErrInvalidEmail
			}
		}
	}

	// Validate degree ID if provided
	if params.DegreeID.IsSome() {
		degreeID := params.DegreeID.Value()
		if degreeID != nil {
			if !s.isValidDegree(ctx, *degreeID) {
				return model.User{}, ErrDegreeNotFound
			}
		}
	}

	// Validate year if provided
	if params.Year.IsSome() {
		year := params.Year.Value()
		if year != nil {
			_, err := model.NewDegreeYear(*year)
			if err != nil {
				return model.User{}, ErrInvalidYear
			}
		}
	}

	return s.userRepo.UpdateUser(ctx, userID, params)
}

// isValidDegree checks if a degree ID exists in the database
func (s *UserService) isValidDegree(ctx context.Context, degreeID string) bool {
	if s.degreeRepo == nil {
		return true // Skip validation if degreeRepo is not configured
	}
	degrees, err := s.degreeRepo.GetAllDegrees(ctx)
	if err != nil {
		return true // Skip validation on error
	}
	for _, degree := range degrees {
		if degree.ID == degreeID {
			return true
		}
	}
	return false
}
