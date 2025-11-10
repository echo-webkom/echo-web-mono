package models

import (
	"time"

	"uno/domain/model"
)

// BanInfoDB represents the database schema for ban_info table
type BanInfoDB struct {
	ID        int       `db:"id"`
	UserID    string    `db:"user_id"`
	BannedBy  string    `db:"banned_by"`
	Reason    string    `db:"reason"`
	CreatedAt time.Time `db:"created_at"`
	ExpiresAt time.Time `db:"expires_at"`
}

// FromDomain converts domain model to database model
func (db *BanInfoDB) FromDomain(ban *model.BanInfo) *BanInfoDB {
	return &BanInfoDB{
		ID:        ban.ID,
		UserID:    ban.UserID,
		BannedBy:  ban.BannedBy,
		Reason:    ban.Reason,
		CreatedAt: ban.CreatedAt,
		ExpiresAt: ban.ExpiresAt,
	}
}

// ToDomain converts database model to domain model
func (db *BanInfoDB) ToDomain() *model.BanInfo {
	return &model.BanInfo{
		ID:        db.ID,
		UserID:    db.UserID,
		BannedBy:  db.BannedBy,
		Reason:    db.Reason,
		CreatedAt: db.CreatedAt,
		ExpiresAt: db.ExpiresAt,
	}
}
