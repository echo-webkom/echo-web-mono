package model

import "time"

type BanInfo struct {
	ID        int       `db:"id" json:"id"`
	UserID    string    `db:"user_id" json:"user_id"`
	BannedBy  string    `db:"banned_by" json:"banned_by"`
	Reason    string    `db:"reason" json:"reason"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
	ExpiresAt time.Time `db:"expires_at" json:"expires_at"`
}

type Dot struct {
	ID        int       `db:"id" json:"id"`
	UserID    string    `db:"user_id" json:"user_id"`
	Count     int       `db:"count" json:"count"`
	Reason    string    `db:"reason" json:"reason"`
	StrikedBy string    `db:"striked_by" json:"striked_by"`
	ExpiresAt time.Time `db:"expires_at" json:"expires_at"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

type AccessRequests struct {
	ID        string    `db:"id" json:"id"`
	Email     string    `db:"email" json:"email"`
	Reason    string    `db:"reason" json:"reason"`
	CreatedAt time.Time `db:"created_at" json:"created_at"`
}

type Whitelist struct {
	Email     string    `db:"email" json:"email"`
	ExpiresAt time.Time `db:"expires_at" json:"expires_at"`
	Reason    string    `db:"reason" json:"reason"`
}
