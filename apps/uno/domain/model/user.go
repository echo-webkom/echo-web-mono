package model

import "time"

type User struct {
	ID               string     `db:"id"`
	Name             *string    `db:"name"`
	Email            string     `db:"email"`
	Image            *string    `db:"image"`
	AlternativeEmail *string    `db:"alternative_email"`
	DegreeID         *string    `db:"degree_id"`
	Year             *int       `db:"year"`
	Type             string     `db:"type"`
	LastSignInAt     *time.Time `db:"last_sign_in_at"`
	UpdatedAt        *time.Time `db:"updated_at"`
	CreatedAt        *time.Time `db:"created_at"`
	HasReadTerms     bool       `db:"has_read_terms"`
	Birthday         *time.Time `db:"birthday"`
	IsPublic         bool       `db:"is_public"`
}

func (u *User) IsProfileComplete() bool {
	return u.DegreeID != nil && u.Year != nil && u.HasReadTerms
}

type Degree struct {
	ID   string `db:"id"`
	Name string `db:"name"`
}

type Account struct {
	UserID            string  `db:"user_id"`
	Type              string  `db:"type"`
	Provider          string  `db:"provider"`
	ProviderAccountID string  `db:"provider_account_id"`
	RefreshToken      *string `db:"refresh_token"`
	AccessToken       *string `db:"access_token"`
	ExpiresAt         *int    `db:"expires_at"`
	TokenType         *string `db:"token_type"`
	Scope             *string `db:"scope"`
	IDToken           *string `db:"id_token"`
	SessionState      *string `db:"session_state"`
}

type Session struct {
	SessionToken string    `db:"session_token"`
	UserID       string    `db:"user_id"`
	Expires      time.Time `db:"expires"`
}

type VerificationToken struct {
	Identifier string    `db:"identifier"`
	Token      string    `db:"token"`
	ExpiresAt  time.Time `db:"expires_at"`
}
