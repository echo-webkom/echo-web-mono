package api

import (
	"errors"
	"uno/domain/model"
	"uno/http/handler"
)

func profilePictureUploadFromContext(ctx *handler.Context) (*model.ProfilePictureUpload, error) {
	file, header, err := ctx.R.FormFile("file")
	if err != nil {
		return nil, errors.New("file is required")
	}

	return &model.ProfilePictureUpload{
		Reader:    file,
		ImageType: model.ProfilePictureImageType(header.Header.Get("Content-Type")),
		Size:      header.Size,
	}, nil
}
