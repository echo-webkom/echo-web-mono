package port

import (
	"context"
	"errors"
	"uno/domain/model"
)

var ErrNoProfilePicture = errors.New("user has no profile picture")

type ProfilePictureRepo interface {
	UploadProfilePicture(ctx context.Context, userID string, picture *model.ProfilePictureUpload) error
	DeleteProfilePicture(ctx context.Context, userID string) error
	GetProfilePicture(ctx context.Context, userID string, size int) (*model.ProfilePicture, error)
}
