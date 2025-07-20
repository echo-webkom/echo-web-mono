package auth

import (
	"context"
	"fmt"
	"time"

	"github.com/echo-webkom/axis/service/account"
	"github.com/echo-webkom/axis/service/session"
	"github.com/echo-webkom/axis/service/user"
	"github.com/jackc/pgx/v5/pgxpool"
	gonanoid "github.com/matoous/go-nanoid/v2"
)

type AuthService struct {
	pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *AuthService {
	return &AuthService{
		pool,
	}
}

// Validates the session ID and checks if it exists in the database.
// If the session ID is valid, it returns the associated user and session.
func (s *AuthService) ValidateSession(ctx context.Context, sessionID string) (ValidateUser, ValidatedSession, error) {
	ss := session.New(s.pool)

	_, err := ss.FindSessionBySessionID(ctx, sessionID)
	return ValidateUser{}, ValidatedSession{}, err
}

func (s *AuthService) GetSession(accessToken string) (sesh ValidatedSession, err error) {
	userInfo, err := getUserInfo(accessToken)
	if err != nil {
		return sesh, err
	}

	if _, ok := s.isAllowedToSignIn(userInfo, accessToken); !ok {
		return sesh, fmt.Errorf("user is not allowed to sign in")
	}

	acc := account.New(s.pool)
	usr := user.New(s.pool)
	ses := session.New(s.pool)

	ctx := context.Background()

	userAccount, err := acc.FindAccountByProvider(ctx, "feide", userInfo.Sub)

	// If we dont find an account tied to the provider auth id,
	// create a new account, user, and new session.
	if err != nil {
		userId, err := gonanoid.New()
		if err != nil {
			return sesh, err
		}

		if err := acc.Create(userId, userInfo.Sub); err != nil {
			return sesh, err
		}

		if err := usr.Create(ctx, userId, userInfo.Name, userInfo.Email); err != nil {
			return sesh, err
		}

		seshId, expires, err := ses.CreateSession(ctx, userId)
		return ValidatedSession{
			Success:      err == nil,
			SessionToken: seshId,
			Expires:      expires,
		}, err
	}

	// Otherwise get the session from the user id
	dbSession, err := ses.FindSessionByUserID(ctx, userAccount.UserID)
	if err != nil || dbSession.Expires.Before(time.Now()) {
		// or create new session if one is not found
		seshID, expires, err := ses.CreateSession(ctx, dbSession.UserID)
		return ValidatedSession{
			Success:      err == nil,
			SessionToken: seshID,
			Expires:      expires,
		}, err
	}

	return ValidatedSession{
		SessionToken: dbSession.SessionToken,
		Success:      true,
		Expires:      dbSession.Expires,
	}, nil
}

func (s *AuthService) isAllowedToSignIn(info FeideUserInfo, accessToken string) (redirectUrl string, ok bool) {
	return "", true
}

func (s *AuthService) IsMemberOfecho(accessToken string) bool {
	return true
}
