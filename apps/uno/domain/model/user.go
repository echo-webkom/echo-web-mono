package model

import "time"

// User represents a user in the system with their profile information.
// This is a domain model focused on business logic and rules.
type User struct {
	ID               string
	Name             *string
	Email            string
	Image            *string
	AlternativeEmail *string
	DegreeID         *string
	Year             *int
	Type             UserType
	LastSignInAt     *time.Time
	UpdatedAt        *time.Time
	CreatedAt        *time.Time
	HasReadTerms     bool
	Birthday         *time.Time
	IsPublic         bool
}

// UserType represents the type of user account
type UserType string

const (
	UserTypeStudent UserType = "student"
	UserTypeAdmin   UserType = "admin"
	// Add other user types as needed
)

// IsProfileComplete checks if the user has completed their profile
// by filling in required fields.
func (u *User) IsProfileComplete() bool {
	return u.DegreeID != nil && u.Year != nil && u.HasReadTerms
}

// CanAccessPrivateInfo checks if the user's profile information
// can be accessed by others.
func (u *User) CanAccessPrivateInfo() bool {
	return u.IsPublic
}

// HasBirthday checks if the user has a birthday set.
func (u *User) HasBirthday() bool {
	return u.Birthday != nil
}

// IsBirthdayToday checks if the user's birthday is today in the given location.
func (u *User) IsBirthdayToday(now time.Time) bool {
	if u.Birthday == nil {
		return false
	}
	return u.Birthday.Month() == now.Month() && u.Birthday.Day() == now.Day()
}

// UpdateLastSignIn updates the last sign in timestamp.
func (u *User) UpdateLastSignIn(timestamp time.Time) {
	u.LastSignInAt = &timestamp
}

// Degree represents an academic degree or study program.
type Degree struct {
	ID   string
	Name string
}

// Account represents an external authentication provider account
// linked to a user (e.g., Feide, Google).
type Account struct {
	UserID            string
	Type              string
	Provider          string
	ProviderAccountID string
	RefreshToken      *string
	AccessToken       *string
	ExpiresAt         *int
	TokenType         *string
	Scope             *string
	IDToken           *string
	SessionState      *string
}

// IsExpired checks if the account token has expired.
func (a *Account) IsExpired(now time.Time) bool {
	if a.ExpiresAt == nil {
		return false
	}
	return now.Unix() > int64(*a.ExpiresAt)
}

// Session represents an active user session.
type Session struct {
	SessionToken string
	UserID       string
	Expires      time.Time
}

// IsExpired checks if the session has expired.
func (s *Session) IsExpired(now time.Time) bool {
	return now.After(s.Expires)
}

// IsValid checks if the session is valid (not expired).
func (s *Session) IsValid(now time.Time) bool {
	return !s.IsExpired(now)
}

// VerificationToken represents a token used for email verification
// or password reset.
type VerificationToken struct {
	Identifier string
	Token      string
	ExpiresAt  time.Time
}

// IsExpired checks if the verification token has expired.
func (v *VerificationToken) IsExpired(now time.Time) bool {
	return now.After(v.ExpiresAt)
}

// IsValid checks if the verification token is valid (not expired).
func (v *VerificationToken) IsValid(now time.Time) bool {
	return !v.IsExpired(now)
}
