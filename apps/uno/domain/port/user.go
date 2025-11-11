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
	GetUsersWithStrikes(ctx context.Context) ([]UserWithStrikes, error)
	GetBannedUsers(ctx context.Context) ([]UserWithBanInfo, error)
	GetUserMemberships(ctx context.Context, userID string) ([]string, error)
	CreateUser(ctx context.Context, user model.User) (model.User, error)
}

type UserWithStrikes struct {
	ID       string  `json:"id"`
	Name     *string `json:"name"`
	Image    *string `json:"image"`
	IsBanned bool    `json:"isBanned"`
	Strikes  int     `json:"strikes"`
}

type BanInfo struct {
	ID           int       `json:"id"`
	Reason       string    `json:"reason"`
	UserID       string    `json:"userId"`
	BannedByID   string    `json:"bannedById"`
	BannedByName *string   `json:"bannedByName"`
	CreatedAt    time.Time `json:"createdAt"`
	ExpiresAt    time.Time `json:"expiresAt"`
}

type DotInfo struct {
	ID            int       `db:"id" json:"id"`
	UserID        string    `db:"user_id" json:"userId"`
	Count         int       `db:"count" json:"count"`
	Reason        string    `db:"reason" json:"reason"`
	CreatedAt     time.Time `db:"created_at" json:"createdAt"`
	ExpiresAt     time.Time `db:"expires_at" json:"expiresAt"`
	StrikedByID   string    `db:"striked_by_id" json:"strikedById"`
	StrikedByName *string   `db:"striked_by_name" json:"strikedByName"`
}

type UserWithBanInfo struct {
	ID      string    `json:"id"`
	Name    *string   `json:"name"`
	Image   *string   `json:"image"`
	BanInfo BanInfo   `json:"banInfo"`
	Dots    []DotInfo `json:"dots"`
}
