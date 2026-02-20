package accessrequest

import (
	"time"

	"uno/domain/model"
)

// CreateAccessRequestRequest represents the incoming HTTP request to create an access request
type CreateAccessRequestRequest struct {
	Email  string `json:"email" validate:"required,email"`
	Reason string `json:"reason" validate:"required,min=10"`
}

// AccessRequestResponse represents the HTTP response for an access request
type AccessRequestResponse struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Reason    string    `json:"reason"`
	CreatedAt time.Time `json:"createdAt"`
}

// ToDomain converts CreateAccessRequestRequest DTO to domain model
func (r *CreateAccessRequestRequest) ToDomain() *model.NewAccessRequest {
	return &model.NewAccessRequest{
		Email:  r.Email,
		Reason: r.Reason,
	}
}

// FromDomain converts domain model to AccessRequestResponse DTO
func (r *AccessRequestResponse) FromDomain(ar *model.AccessRequest) *AccessRequestResponse {
	return &AccessRequestResponse{
		ID:        ar.ID,
		Email:     ar.Email,
		Reason:    ar.Reason,
		CreatedAt: ar.CreatedAt,
	}
}

// AccessRequestsFromDomainList converts a slice of domain models to DTOs
func AccessRequestsFromDomainList(accessRequests []model.AccessRequest) []AccessRequestResponse {
	response := make([]AccessRequestResponse, len(accessRequests))
	for i, ar := range accessRequests {
		response[i] = *new(AccessRequestResponse).FromDomain(&ar)
	}
	return response
}
