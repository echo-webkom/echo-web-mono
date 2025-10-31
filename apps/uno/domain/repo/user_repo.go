package repo

import (
	"context"
	"time"
	"uno/domain/model"
)

type UserRepo interface {
	GetUserByID(ctx context.Context, id string) (model.User, error)
	GetUsersByIDs(ctx context.Context, ids []string) ([]model.User, error)
	GetUsersWithBirthday(ctx context.Context, date time.Time) ([]model.User, error)
}
