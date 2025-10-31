package repo

import (
	"context"
	"uno/domain/model"
)

type UserRepo interface {
	GetUserById(ctx context.Context, id string) (model.User, error)
}
