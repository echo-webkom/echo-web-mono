package model

import "time"

type BanInfo struct {
	ID        int       `db:"id"`
	UserID    string    `db:"user_id"`
	BannedBy  string    `db:"banned_by"`
	Reason    string    `db:"reason"`
	CreatedAt time.Time `db:"created_at"`
	ExpiresAt time.Time `db:"expires_at"`
}

type Dot struct {
	ID        int       `db:"id"`
	UserID    string    `db:"user_id"`
	Count     int       `db:"count"`
	Reason    string    `db:"reason"`
	StrikedBy string    `db:"striked_by"`
	ExpiresAt time.Time `db:"expires_at"`
	CreatedAt time.Time `db:"created_at"`
}

type AccessRequests struct {
	ID        string    `db:"id"`
	Email     string    `db:"email"`
	Reason    string    `db:"reason"`
	CreatedAt time.Time `db:"created_at"`
}

type Whitelist struct {
	Email     string    `db:"email"`
	ExpiresAt time.Time `db:"expires_at"`
	Reason    string    `db:"reason"`
}
