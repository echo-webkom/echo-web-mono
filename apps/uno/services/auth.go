package services

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type AuthService struct {
	sessionRepo repo.SessionRepo
	userRepo    repo.UserRepo
}

func NewAuthService(sessionRepo repo.SessionRepo, userRepo repo.UserRepo) *AuthService {
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
