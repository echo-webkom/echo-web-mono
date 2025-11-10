package model

import "time"

type BanInfo struct {
	ID        int       `db:"id" json:"id"`
	UserID    string    `db:"user_id" json:"userId"`
	BannedBy  string    `db:"banned_by" json:"bannedBy"`
	Reason    string    `db:"reason" json:"reason"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
	ExpiresAt time.Time `db:"expires_at" json:"expiresAt"`
}

type Dot struct {
	ID        int       `db:"id" json:"id"`
	UserID    string    `db:"user_id" json:"userId"`
	Count     int       `db:"count" json:"count"`
	Reason    string    `db:"reason" json:"reason"`
	StrikedBy string    `db:"striked_by" json:"strikedBy"`
	ExpiresAt time.Time `db:"expires_at" json:"expiresAt"`
	CreatedAt time.Time `db:"created_at" json:"createdAt"`
}

type AccessRequest struct {
	ID        string
	Email     string
	Reason    string
	CreatedAt time.Time
}

type NewAccessRequest struct {
	Email  string
	Reason string
}

type Whitelist struct {
	Email     string    `db:"email" json:"email"`
	ExpiresAt time.Time `db:"expires_at" json:"expiresAt"`
	Reason    string    `db:"reason" json:"reason"`
}
