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
	Success      bool      `json:"success"`
	SessionToken string    `json:"sessionToken"`
	Expires      time.Time `json:"expires"`
}

type FeideUserInfo struct {
	Iss      string `json:"iss"`
	Jti      string `json:"jti"`
	Aud      string `json:"aud"`
	Sub      string `json:"sub"`
	Iat      int    `json:"iat"`
	Exp      int    `json:"exp"`
	AuthTime int    `json:"auth_time"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Picture  string `json:"picture"`
}
