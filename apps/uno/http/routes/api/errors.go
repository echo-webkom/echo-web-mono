package api

import (
	"errors"
)

var (
	ErrInternalServer   = errors.New("internal server error")
	ErrFailedToReadJSON = errors.New("failed to read json data")
)
