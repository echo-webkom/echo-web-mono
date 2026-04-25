package dto

type SessionResponse struct {
	SessionToken string `json:"sessionToken"`
	UserID       string `json:"userId"`
	ExpiresAt    string `json:"expiresAt"`
}
