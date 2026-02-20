package whitelist

import (
	"time"

	"uno/domain/model"
)

// CreateWhitelistRequest represents the incoming HTTP request to create a whitelist entry
type CreateWhitelistRequest struct {
	Email     string    `json:"email" validate:"required,email"`
	ExpiresAt time.Time `json:"expiresAt" validate:"required"`
	Reason    string    `json:"reason" validate:"required"`
}

// WhitelistResponse represents the HTTP response for a whitelist entry
type WhitelistResponse struct {
	Email     string    `json:"email"`
	ExpiresAt time.Time `json:"expiresAt"`
	Reason    string    `json:"reason"`
}

// ToDomain converts CreateWhitelistRequest DTO to domain model
func (r *CreateWhitelistRequest) ToDomain() *model.NewWhitelist {
	return &model.NewWhitelist{
		Email:     r.Email,
		ExpiresAt: r.ExpiresAt,
		Reason:    r.Reason,
	}
}

// FromDomain converts domain model to WhitelistResponse DTO
func (r *WhitelistResponse) FromDomain(wl *model.Whitelist) *WhitelistResponse {
	return &WhitelistResponse{
		Email:     wl.Email,
		ExpiresAt: wl.ExpiresAt,
		Reason:    wl.Reason,
	}
}

// FromWhitelistDomainList converts a slice of domain models to DTOs
func FromWhitelistDomainList(whitelists []model.Whitelist) []WhitelistResponse {
	response := make([]WhitelistResponse, len(whitelists))
	for i, wl := range whitelists {
		response[i] = *new(WhitelistResponse).FromDomain(&wl)
	}
	return response
}
