package service

import (
	"context"
	"uno/domain/model"
)

type SessionService struct {
}

func (s *SessionService) GetAuthFromSessionToken(ctx context.Context, token string) (model.Auth, error) {
	return model.Auth{}, nil
}
