package record

import (
	"time"

	"uno/domain/model"
)

// DotDB represents the database schema for dot table
type DotDB struct {
	ID        int       `db:"id"`
	UserID    string    `db:"user_id"`
	Count     int       `db:"count"`
	Reason    string    `db:"reason"`
	StrikedBy string    `db:"striked_by"`
	ExpiresAt time.Time `db:"expires_at"`
	CreatedAt time.Time `db:"created_at"`
}

// FromDomain converts domain model to database model
func (db *DotDB) FromDomain(dot *model.Dot) *DotDB {
	return &DotDB{
		ID:        dot.ID,
		UserID:    dot.UserID,
		Count:     dot.Count,
		Reason:    dot.Reason,
		StrikedBy: dot.StrikedBy,
		ExpiresAt: dot.ExpiresAt,
		CreatedAt: dot.CreatedAt,
	}
}

// ToDomain converts database model to domain model
func (db *DotDB) ToDomain() *model.Dot {
	return &model.Dot{
		ID:        db.ID,
		UserID:    db.UserID,
		Count:     db.Count,
		Reason:    db.Reason,
		StrikedBy: db.StrikedBy,
		ExpiresAt: db.ExpiresAt,
		CreatedAt: db.CreatedAt,
	}
}
