package model

import "time"

type BanInfo struct {
	ID        int
	UserID    string
	BannedBy  string
	Reason    string
	CreatedAt time.Time
	ExpiresAt time.Time
}

type NewBanInfo struct {
	UserID    string
	BannedBy  string
	Reason    string
	ExpiresAt time.Time
}

type Dot struct {
	ID        int
	UserID    string
	Count     int
	Reason    string
	StrikedBy string
	ExpiresAt time.Time
	CreatedAt time.Time
}

type NewDot struct {
	UserID    string
	Count     int
	Reason    string
	StrikedBy string
	ExpiresAt time.Time
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
	Email     string
	ExpiresAt time.Time
	Reason    string
}

type NewWhitelist struct {
	Email     string
	ExpiresAt time.Time
	Reason    string
}
