package auth

import "time"

type ValidateUser struct {
	ID               string     `json:"id"`
	Name             *string    `json:"name,omitempty"`
	Email            string     `json:"email"`
	Image            *string    `json:"image,omitempty"`
	AlternativeEmail *string    `json:"alternativeEmail,omitempty"`
	Degree           *string    `json:"degree,omitempty"`
	Year             *int       `json:"year,omitempty"`
	Birthday         *time.Time `json:"birthday,omitempty"`
}

type ValidatedSession struct {
	SessionToken string    `json:"sessionToken"`
	Expires      time.Time `json:"expires"`
}
