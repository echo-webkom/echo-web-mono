package filestorage

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"

	"github.com/minio/minio-go/v7"
)

const (
	ProfilePictureBucketName = "profile-pictures"
)

type ProfilePictureRepo struct {
	minio  *FileStorage
	logger port.Logger
}

func NewProfilePictureStore(ctx context.Context, fileStorage *FileStorage, logger port.Logger) (port.ProfilePictureRepo, error) {
	exists, err := fileStorage.BucketExists(ctx, ProfilePictureBucketName)
	if err != nil {
		return nil, err
	}

	if !exists {
		logger.Info(ctx, "bucket not found, creating", "bucket", ProfilePictureBucketName)
		if err := fileStorage.MakeBucket(ctx, ProfilePictureBucketName, minio.MakeBucketOptions{}); err != nil {
			return nil, err
		}
		logger.Info(ctx, "bucket created", "bucket", ProfilePictureBucketName)
	} else {
		logger.Info(ctx, "bucket found", "bucket", ProfilePictureBucketName)
	}

	return &ProfilePictureRepo{minio: fileStorage, logger: logger}, nil
}

// DeleteProfilePicture deletes a profile picture for a given user ID. It returns an error if the deletion fails.
func (p *ProfilePictureRepo) DeleteProfilePicture(ctx context.Context, userID string) error {
	p.logger.Info(ctx, "deleting profile picture", "userID", userID)
	err := p.minio.RemoveObject(ctx, ProfilePictureBucketName, userID, minio.RemoveObjectOptions{})
	if err != nil {
		p.logger.Error(ctx, "failed to delete profile picture", "userID", userID, "error", err)
		return err
	}
	return nil
}

// GetProfilePicture retrieves a profile picture for a given user ID. It returns the picture data and an error if the retrieval fails.
func (p *ProfilePictureRepo) GetProfilePicture(ctx context.Context, userID string) (*model.ProfilePicture, error) {
	p.logger.Info(ctx, "retrieving profile picture", "userID", userID)
	object, err := p.minio.GetObject(ctx, ProfilePictureBucketName, userID, minio.GetObjectOptions{})
	if err != nil {
		p.logger.Error(ctx, "failed to retrieve profile picture", "userID", userID, "error", err)
		return nil, err
	}

	stat, err := object.Stat()
	if err != nil {
		p.logger.Error(ctx, "failed to stat profile picture", "userID", userID, "error", err)
		return nil, err
	}

	return &model.ProfilePicture{
		ReadCloser:   object,
		ContentType:  stat.ContentType,
		ETag:         stat.ETag,
		LastModified: stat.LastModified,
		Size:         stat.Size,
	}, nil
}

// UploadProfilePicture uploads a profile picture for a given user ID. It returns an error if the upload fails.
func (p *ProfilePictureRepo) UploadProfilePicture(ctx context.Context, userID string, picture *model.ProfilePictureUpload) error {
	p.logger.Info(ctx, "uploading profile picture", "userID", userID)
	_, err := p.minio.PutObject(ctx, ProfilePictureBucketName, userID, picture.Reader, picture.Size, minio.PutObjectOptions{
		ContentType: string(picture.ImageType),
	})
	if err != nil {
		p.logger.Error(ctx, "failed to upload profile picture", "userID", userID, "error", err)
	}
	return err
}
