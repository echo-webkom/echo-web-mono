package model

import "time"

type User struct {
	ID               string     `db:"id" json:"id"`
	Name             *string    `db:"name" json:"name,omitempty"`
	Email            string     `db:"email" json:"email"`
	Image            *string    `db:"image" json:"image,omitempty"`
	AlternativeEmail *string    `db:"alternative_email" json:"alternativeEmail,omitempty"`
	DegreeID         *string    `db:"degree_id" json:"degreeId,omitempty"`
	Year             *int       `db:"year" json:"year,omitempty"`
	Type             string     `db:"type" json:"type"`
	LastSignInAt     *time.Time `db:"last_sign_in_at" json:"lastSignInAt,omitempty"`
	UpdatedAt        *time.Time `db:"updated_at" json:"updatedAt,omitempty"`
	CreatedAt        *time.Time `db:"created_at" json:"createdAt,omitempty"`
	HasReadTerms     bool       `db:"has_read_terms" json:"hasReadTerms"`
	Birthday         *time.Time `db:"birthday" json:"birthday,omitempty"`
	IsPublic         bool       `db:"is_public" json:"isPublic"`
}

func (u *User) IsProfileComplete() bool {
	return u.DegreeID != nil && u.Year != nil && u.HasReadTerms
}

type Degree struct {
	ID   string `db:"id" json:"id"`
	Name string `db:"name" json:"name"`
}

type Account struct {
	UserID            string  `db:"user_id" json:"userId"`
	Type              string  `db:"type" json:"type"`
	Provider          string  `db:"provider" json:"provider"`
	ProviderAccountID string  `db:"provider_account_id" json:"providerAccountId"`
	RefreshToken      *string `db:"refresh_token" json:"refreshToken,omitempty"`
	AccessToken       *string `db:"access_token" json:"accessToken,omitempty"`
	ExpiresAt         *int    `db:"expires_at" json:"expiresAt,omitempty"`
	TokenType         *string `db:"token_type" json:"tokenType,omitempty"`
	Scope             *string `db:"scope" json:"scope,omitempty"`
	IDToken           *string `db:"id_token" json:"idToken,omitempty"`
	SessionState      *string `db:"session_state" json:"sessionState,omitempty"`
}

type Session struct {
	SessionToken string    `db:"session_token" json:"sessionToken"`
	UserID       string    `db:"user_id" json:"userId"`
	Expires      time.Time `db:"expires" json:"expires"`
}

type VerificationToken struct {
	Identifier string    `db:"identifier" json:"identifier"`
	Token      string    `db:"token" json:"token"`
	ExpiresAt  time.Time `db:"expires_at" json:"expiresAt"`
}
