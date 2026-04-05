package port

import (
	"context"
	"time"
	"uno/domain/model"
)

type UserRepo interface {
	GetAllUsers(ctx context.Context) ([]model.User, error)
	GetUserByID(ctx context.Context, id string) (model.User, error)
	GetUsersByIDs(ctx context.Context, ids []string) ([]model.User, error)
	GetUsersWithBirthday(ctx context.Context, date time.Time) ([]model.User, error)
	ResetUserYears(ctx context.Context) (int64, error)
	GetUsersWithStrikeDetails(ctx context.Context) ([]model.UserWithStrikeDetails, error)
	GetUserWithStrikeDetailsByID(ctx context.Context, userID string) (*model.UserWithStrikeDetails, error)
	GetUserMemberships(ctx context.Context, userID string) ([]string, error)
	CreateUser(ctx context.Context, user model.User) (model.User, error)
	UpdateUserImage(ctx context.Context, userID string, hasImage bool) error
	SearchUsersByName(ctx context.Context, query string, limit int) ([]model.User, error)
	GetUserGroupIDs(ctx context.Context, feideID string) ([]string, error)
	GetUserByEmail(ctx context.Context, email string) (model.User, error)
	UpdateUserLastSignIn(ctx context.Context, userID string) error
	CreateUserAndAccount(ctx context.Context, user model.User, account model.NewAccount) (model.User, error)
}
