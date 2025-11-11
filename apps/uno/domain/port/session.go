package port

import (
	"context"
	"uno/domain/model"
)

type SessionRepo interface {
	GetSessionByToken(ctx context.Context, token string) (model.Session, error)
}
