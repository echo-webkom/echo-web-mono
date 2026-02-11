package models

import (
	"time"

	"uno/domain/model"
)

// BanInfo represents the database schema for ban_info table
type BanInfo struct {
	ID           int       `db:"id"`
	UserID       string    `db:"user_id"`
	BannedByID   string    `db:"banned_by_id"`
	BannedByName *string   `db:"banned_by_name"`
	Reason       string    `db:"reason"`
	CreatedAt    time.Time `db:"created_at"`
	ExpiresAt    time.Time `db:"expires_at"`
}

// FromDomain converts domain model to database model
func (db *BanInfo) FromDomain(ban *model.BanInfo) *BanInfo {
	return &BanInfo{
		ID:           ban.ID,
		UserID:       ban.UserID,
		BannedByID:   ban.BannedByID,
		BannedByName: ban.BannedByName,
		Reason:       ban.Reason,
		CreatedAt:    ban.CreatedAt,
		ExpiresAt:    ban.ExpiresAt,
	}
}

// ToDomain converts database model to domain model
func (db *BanInfo) ToDomain() *model.BanInfo {
	return &model.BanInfo{
		ID:           db.ID,
		UserID:       db.UserID,
		BannedByID:   db.BannedByID,
		BannedByName: db.BannedByName,
		Reason:       db.Reason,
		CreatedAt:    db.CreatedAt,
		ExpiresAt:    db.ExpiresAt,
	}
}

type UserWithBanInfo struct {
	ID      string    `db:"id"`
	Name    *string   `db:"name"`
	Image   *string   `db:"image"`
	BanInfo BanInfo   `db:"ban_info"`
	Dots    []DotInfo `db:"dots"`
}

func (u *UserWithBanInfo) ToDomain() *model.UserWithBanInfo {
	var dots []model.DotInfo
	for _, d := range u.Dots {
		dots = append(dots, model.DotInfo{
			ID:            d.ID,
			UserID:        d.UserID,
			Count:         d.Count,
			Reason:        d.Reason,
			CreatedAt:     d.CreatedAt,
			ExpiresAt:     d.ExpiresAt,
			StrikedByID:   d.StrikedByID,
			StrikedByName: d.StrikedByName,
		})
	}

	return &model.UserWithBanInfo{
		ID:    u.ID,
		Name:  u.Name,
		Image: u.Image,
		BanInfo: model.BanInfo{
			ID:           u.BanInfo.ID,
			UserID:       u.BanInfo.UserID,
			Reason:       u.BanInfo.Reason,
			BannedByID:   u.BanInfo.BannedByID,
			BannedByName: u.BanInfo.BannedByName,
			CreatedAt:    u.BanInfo.CreatedAt,
			ExpiresAt:    u.BanInfo.ExpiresAt,
		},
		Dots: dots,
	}
}

type DotInfo struct {
	ID            int       `db:"id"`
	UserID        string    `db:"user_id"`
	Count         int       `db:"count"`
	Reason        string    `db:"reason"`
	CreatedAt     time.Time `db:"created_at"`
	ExpiresAt     time.Time `db:"expires_at"`
	StrikedByID   string    `db:"striked_by_id"`
	StrikedByName *string   `db:"striked_by_name"`
}

func UserWithBanInfoList(dbList []UserWithBanInfo) []model.UserWithBanInfo {
	var domainList []model.UserWithBanInfo
	for _, dbItem := range dbList {
		domainList = append(domainList, *dbItem.ToDomain())
	}
	return domainList
}

type ModBanInfo struct {
	ID        int       `db:"id"`
	UserID    string    `db:"user_id"`
	BannedBy  string    `db:"banned_by"`
	Reason    string    `db:"reason"`
	CreatedAt time.Time `db:"created_at"`
	ExpiresAt time.Time `db:"expires_at"`
}

func (db *ModBanInfo) ToDomain() *model.ModBanInfo {
	return &model.ModBanInfo{
		ID:        db.ID,
		UserID:    db.UserID,
		BannedBy:  db.BannedBy,
		Reason:    db.Reason,
		CreatedAt: db.CreatedAt,
		ExpiresAt: db.ExpiresAt,
	}
}

func (db *ModBanInfo) ToBanInfo() *model.BanInfo {
	return &model.BanInfo{
		ID:         db.ID,
		UserID:     db.UserID,
		BannedByID: db.BannedBy,
		Reason:     db.Reason,
		CreatedAt:  db.CreatedAt,
		ExpiresAt:  db.ExpiresAt,
	}
}
