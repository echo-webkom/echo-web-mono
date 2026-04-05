package port

import (
	"context"
	"uno/domain/model"
)

type SessionRepo interface {
	GetSessionByToken(ctx context.Context, token string) (model.Session, error)
	CreateSession(ctx context.Context, session model.NewSession) (model.Session, error)
	DeleteSession(ctx context.Context, token string) error
}
