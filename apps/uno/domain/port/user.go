package port

import (
	"context"
	"time"
	"uno/domain/model"
)

type UserRepo interface {
	GetUserByID(ctx context.Context, id string) (model.User, error)
	GetUsersByIDs(ctx context.Context, ids []string) ([]model.User, error)
	GetUsersWithBirthday(ctx context.Context, date time.Time) ([]model.User, error)
	GetUsersWithStrikes(ctx context.Context) ([]model.UserWithStrikes, error)
	GetBannedUsers(ctx context.Context) ([]model.UserWithBanInfo, error)
	GetUserMemberships(ctx context.Context, userID string) ([]string, error)
	CreateUser(ctx context.Context, user model.User) (model.User, error)
}
