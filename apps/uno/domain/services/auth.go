package services

import (
	"context"
	"uno/domain/model"
	"uno/domain/ports"
)

type AuthService struct {
	sessionRepo ports.SessionRepo
	userRepo    ports.UserRepo
}

func NewAuthService(sessionRepo ports.SessionRepo, userRepo ports.UserRepo) *AuthService {
	return &AuthService{
		sessionRepo: sessionRepo,
		userRepo:    userRepo,
	}
}

func (as *AuthService) ValidateToken(ctx context.Context, token string) (model.User, model.Session, error) {
	session, err := as.sessionRepo.GetSessionByToken(ctx, token)
	if err != nil {
		return model.User{}, model.Session{}, err
	}

	user, err := as.userRepo.GetUserByID(ctx, session.UserID)
	if err != nil {
		return model.User{}, model.Session{}, err
	}

	return user, session, nil
}

func (as *AuthService) SessionRepo() ports.SessionRepo {
	return as.sessionRepo
}

func (as *AuthService) UserRepo() ports.UserRepo {
	return as.userRepo
}
