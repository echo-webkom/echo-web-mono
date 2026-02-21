package filestorage

import (
	"bytes"
	"context"
	"image"
	_ "image/gif"
	"image/jpeg"
	_ "image/png"
	"uno/domain/model"
	"uno/domain/port"

	"github.com/minio/minio-go/v7"
	"golang.org/x/image/draw"
	_ "golang.org/x/image/webp"
)

const (
	ProfilePictureBucketName = "profile-pictures"

	profilePictureSuffixThumb  = "_1"
	profilePictureSuffixMedium = "_2"

	profilePictureSizeThumb  = 150
	profilePictureSizeMedium = 300
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

	// Ensure that the bucket for profile pictures exists. If it doesn't, create it.
	// Useful in development and testing environments where the bucket might not be pre-created.
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

// DeleteProfilePicture deletes all size variants of a profile picture for a given user ID.
func (p *ProfilePictureRepo) DeleteProfilePicture(ctx context.Context, userID string) error {
	p.logger.Info(ctx, "deleting profile picture", "userID", userID)

	// Delete all variants of the profile picture
	keys := []string{userID, userID + profilePictureSuffixThumb, userID + profilePictureSuffixMedium}
	for _, key := range keys {
		if err := p.minio.RemoveObject(ctx, ProfilePictureBucketName, key, minio.RemoveObjectOptions{}); err != nil {
			p.logger.Error(ctx, "failed to delete profile picture", "key", key, "error", err)
			return err
		}
	}
	return nil
}

// GetProfilePicture retrieves a profile picture for a given user ID. If id is not found we just return the
// original size variant.
func (p *ProfilePictureRepo) GetProfilePicture(ctx context.Context, userID string, size int) (*model.ProfilePicture, error) {
	key := userID
	switch size {
	case 1:
		key = userID + profilePictureSuffixThumb
	case 2:
		key = userID + profilePictureSuffixMedium
	}

	// Retrive the profile picture of requested size
	p.logger.Info(ctx, "retrieving profile picture", "userID", userID, "size", size)
	object, err := p.minio.GetObject(ctx, ProfilePictureBucketName, key, minio.GetObjectOptions{})
	if err != nil {
		p.logger.Error(ctx, "failed to retrieve profile picture", "key", key, "error", err)
		return nil, err
	}

	// Check that the object exists
	stat, err := object.Stat()
	if err != nil {
		p.logger.Error(ctx, "failed to stat profile picture", "key", key, "error", err)
		return nil, err
	}

	// Return the core model for the profile picture
	return &model.ProfilePicture{
		ReadCloser:   object,
		ContentType:  stat.ContentType,
		ETag:         stat.ETag,
		LastModified: stat.LastModified,
		Size:         stat.Size,
	}, nil
}

// UploadProfilePicture uploads a profile picture for a given user ID.
// It stores the original and resized variants. It also checks that the
// dimensions of the uploaded image are valid so that we don't fill up memory with huge images.
func (p *ProfilePictureRepo) UploadProfilePicture(ctx context.Context, userID string, picture *model.ProfilePictureUpload) error {
	p.logger.Info(ctx, "uploading profile picture", "userID", userID)

	data := picture.Bytes()
	_, err := p.minio.PutObject(ctx, ProfilePictureBucketName, userID, bytes.NewReader(data), int64(len(data)), minio.PutObjectOptions{
		ContentType: string(picture.ImageType),
	})
	if err != nil {
		p.logger.Error(ctx, "failed to upload original profile picture", "userID", userID, "error", err)
		return err
	}

	// Decode the image so that we can create resized variants
	img, _, err := image.Decode(picture.Reader())
	if err != nil {
		p.logger.Error(ctx, "failed to decode image for resizing, skipping variants", "userID", userID, "error", err)
		return nil
	}

	// Create and upload resized variants
	variants := []struct {
		suffix  string
		maxSize int
	}{
		{suffix: profilePictureSuffixMedium, maxSize: profilePictureSizeMedium},
		{suffix: profilePictureSuffixThumb, maxSize: profilePictureSizeThumb},
	}
	for _, variant := range variants {
		if err := p.uploadResized(ctx, userID+variant.suffix, img, variant.maxSize); err != nil {
			p.logger.Error(ctx, "failed to upload resized profile picture", "userID", userID, "variant", variant.suffix, "error", err)
			return err
		}
	}

	return nil
}

func (p *ProfilePictureRepo) uploadResized(ctx context.Context, key string, img image.Image, maxSize int) error {
	resized := resizeImage(img, maxSize)

	var buf bytes.Buffer
	if err := jpeg.Encode(&buf, resized, nil); err != nil {
		return err
	}

	data := buf.Bytes()
	_, err := p.minio.PutObject(ctx, ProfilePictureBucketName, key, bytes.NewReader(data), int64(len(data)), minio.PutObjectOptions{
		ContentType: "image/jpeg",
	})
	return err
}

func resizeImage(src image.Image, maxSize int) image.Image {
	bounds := src.Bounds()
	srcW := bounds.Dx()
	srcH := bounds.Dy()

	if srcW <= maxSize && srcH <= maxSize {
		return src
	}

	var dstW, dstH int
	if srcW > srcH {
		dstW = maxSize
		dstH = int(float64(srcH) * float64(maxSize) / float64(srcW))
	} else {
		dstH = maxSize
		dstW = int(float64(srcW) * float64(maxSize) / float64(srcH))
	}

	if dstW < 1 {
		dstW = 1
	}
	if dstH < 1 {
		dstH = 1
	}

	dst := image.NewRGBA(image.Rect(0, 0, dstW, dstH))
	draw.BiLinear.Scale(dst, dst.Bounds(), src, src.Bounds(), draw.Over, nil)
	return dst
}
