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
	GetUsersWithStrikes(ctx context.Context) ([]UserWithStrikes, error)
	GetBannedUsers(ctx context.Context) ([]UserWithBanInfo, error)
}

type UserWithStrikes struct {
	ID       string  `json:"id"`
	Name     string  `json:"name"`
	ImageURL *string `json:"image_url"`
	IsBanned bool    `json:"is_banned"`
	Strikes  int     `json:"strikes"`
}

type BanInfo struct {
	ID           int       `json:"id"`
	Reason       string    `json:"reason"`
	UserID       string    `json:"user_id"`
	BannedByID   string    `json:"banned_by_id"`
	BannedByName string    `json:"banned_by_name"`
	CreatedAt    time.Time `json:"created_at"`
	ExpiresAt    time.Time `json:"expires_at"`
}

type DotInfo struct {
	ID            int       `json:"id"`
	UserID        string    `json:"user_id"`
	Count         int       `json:"count"`
	Reason        string    `json:"reason"`
	CreatedAt     time.Time `json:"created_at"`
	ExpiresAt     time.Time `json:"expires_at"`
	StrikedByID   string    `json:"striked_by_id"`
	StrikedByName string    `json:"striked_by_name"`
}

type UserWithBanInfo struct {
	ID      string    `json:"id"`
	Name    *string   `json:"name,omitempty"`
	Image   *string   `json:"image,omitempty"`
	BanInfo BanInfo   `json:"ban_info"`
	Dots    []DotInfo `json:"dots"`
}
