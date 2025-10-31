package model

import "time"

type User struct {
	ID               string     `db:"id" json:"id"`
	Name             *string    `db:"name" json:"name,omitempty"`
	Email            string     `db:"email" json:"email"`
	Image            *string    `db:"image" json:"image,omitempty"`
	AlternativeEmail *string    `db:"alternative_email" json:"alternative_email,omitempty"`
	DegreeID         *string    `db:"degree_id" json:"degree_id,omitempty"`
	Year             *int       `db:"year" json:"year,omitempty"`
	Type             string     `db:"type" json:"type"`
	LastSignInAt     *time.Time `db:"last_sign_in_at" json:"last_sign_in_at,omitempty"`
	UpdatedAt        *time.Time `db:"updated_at" json:"updated_at,omitempty"`
	CreatedAt        *time.Time `db:"created_at" json:"created_at,omitempty"`
	HasReadTerms     bool       `db:"has_read_terms" json:"has_read_terms"`
	Birthday         *time.Time `db:"birthday" json:"birthday,omitempty"`
	IsPublic         bool       `db:"is_public" json:"is_public"`
}

func (u *User) IsProfileComplete() bool {
	return u.DegreeID != nil && u.Year != nil && u.HasReadTerms
}

type Degree struct {
	ID   string `db:"id" json:"id"`
	Name string `db:"name" json:"name"`
}

type Account struct {
	UserID            string  `db:"user_id" json:"user_id"`
	Type              string  `db:"type" json:"type"`
	Provider          string  `db:"provider" json:"provider"`
	ProviderAccountID string  `db:"provider_account_id" json:"provider_account_id"`
	RefreshToken      *string `db:"refresh_token" json:"refresh_token,omitempty"`
	AccessToken       *string `db:"access_token" json:"access_token,omitempty"`
	ExpiresAt         *int    `db:"expires_at" json:"expires_at,omitempty"`
	TokenType         *string `db:"token_type" json:"token_type,omitempty"`
	Scope             *string `db:"scope" json:"scope,omitempty"`
	IDToken           *string `db:"id_token" json:"id_token,omitempty"`
	SessionState      *string `db:"session_state" json:"session_state,omitempty"`
}

type Session struct {
	SessionToken string    `db:"session_token" json:"session_token"`
	UserID       string    `db:"user_id" json:"user_id"`
	Expires      time.Time `db:"expires" json:"expires"`
}

type VerificationToken struct {
	Identifier string    `db:"identifier" json:"identifier"`
	Token      string    `db:"token" json:"token"`
	ExpiresAt  time.Time `db:"expires_at" json:"expires_at"`
}
