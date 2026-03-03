package dto

import (
	"encoding/json"
	"time"

	"uno/domain/model"
)

// RegistrationResponse represents the registration data returned in API responses.
type RegistrationResponse struct {
	UserID           string     `json:"userId" validate:"required"`
	HappeningID      string     `json:"happeningId" validate:"required"`
	Status           string     `json:"status" validate:"required"`
	UnregisterReason *string    `json:"unregisterReason" validate:"required"`
	CreatedAt        time.Time  `json:"createdAt" validate:"required"`
	PrevStatus       *string    `json:"prevStatus" validate:"required"`
	ChangedAt        *time.Time `json:"changedAt" validate:"required"`
	ChangedBy        *string    `json:"changedBy" validate:"required"`
}

// FromDomain converts a domain Registration model to a RegistrationResponse DTO.
func (dto *RegistrationResponse) FromDomain(r *model.Registration) *RegistrationResponse {
	return &RegistrationResponse{
		UserID:           r.UserID,
		HappeningID:      r.HappeningID,
		Status:           string(r.Status),
		UnregisterReason: r.UnregisterReason,
		CreatedAt:        r.CreatedAt,
		PrevStatus:       r.PrevStatus,
		ChangedAt:        r.ChangedAt,
		ChangedBy:        r.ChangedBy,
	}
}

// RegistrationListFromDomain converts a slice of domain Registration models to RegistrationResponse DTOs.
func RegistrationListFromDomain(registrations []model.Registration) []RegistrationResponse {
	dtos := make([]RegistrationResponse, len(registrations))
	for i, reg := range registrations {
		dtos[i] = *(&RegistrationResponse{}).FromDomain(&reg)
	}
	return dtos
}

// RegisterForHappeningRequest represents the request body for registering for a happening.
// This is used in the API endpoint where the happening ID comes from the URL path.
type RegisterForHappeningRequest struct {
	UserID    string              `json:"userId" validate:"required"`
	Questions []QuestionAnswerDTO `json:"questions" validate:"required"`
}

// QuestionAnswerDTO represents a question answer in the HTTP request/response.
type QuestionAnswerDTO struct {
	QuestionID string          `json:"questionId" validate:"required"`
	Answer     json.RawMessage `json:"answer" validate:"required"`
}

// ToDomain converts a QuestionAnswerDTO to a domain QuestionAnswer model.
func (dto *QuestionAnswerDTO) ToDomain() *model.QuestionAnswer {
	return &model.QuestionAnswer{
		QuestionID: dto.QuestionID,
		Answer:     dto.Answer,
	}
}

// QuestionAnswerListToDomain converts a slice of DTOs to domain models.
func QuestionAnswerListToDomain(dtos []QuestionAnswerDTO) []model.QuestionAnswer {
	answers := make([]model.QuestionAnswer, len(dtos))
	for i, dto := range dtos {
		answers[i] = *dto.ToDomain()
	}
	return answers
}

// RegisterForHappeningResponse represents the response for a registration request.
type RegisterForHappeningResponse struct {
	Success      bool   `json:"success" validate:"required"`
	Message      string `json:"message" validate:"required"`
	IsWaitlisted bool   `json:"isWaitlisted" validate:"required"`
}

// UnregisterRequest represents the request body for unregistering from a happening.
type UnregisterRequest struct {
	Reason string `json:"reason" validate:"required"`
}

// ChangeRegistrationStatusRequest represents the request body for changing a registration status.
type ChangeRegistrationStatusRequest struct {
	Status string `json:"status" validate:"required"`
}

// RegistrationCount represents aggregated registration counts for a happening.
type RegistrationCount struct {
	HappeningID string `json:"happeningId" validate:"required"`
	Waiting     int    `json:"waiting" validate:"required"`
	Registered  int    `json:"registered" validate:"required"`
	Max         *int   `json:"max" validate:"required"`
}

func (RegistrationCount) FromDomain(grp model.RegistrationCount) RegistrationCount {
	return RegistrationCount{
		HappeningID: grp.HappeningID,
		Waiting:     grp.Waiting,
		Registered:  grp.Registered,
		Max:         grp.Max,
	}
}

func RegistrationCountsFromDomain(grs []model.RegistrationCount) []RegistrationCount {
	dtos := make([]RegistrationCount, len(grs))
	for i, gr := range grs {
		dtos[i] = (RegistrationCount{}).FromDomain(gr)
	}
	return dtos
}

// RegistrationStatusResponse represents a simple registration status check response.
type RegistrationStatusResponse struct {
	IsRegistered bool   `json:"isRegistered" validate:"required"`
	IsWaitlisted bool   `json:"isWaitlisted" validate:"required"`
	Status       string `json:"status" validate:"required"`
}

// HappeningRegistrationResponse represents the registration data with user info returned in API responses.
type HappeningRegistrationResponse struct {
	UserID           string     `json:"userId" validate:"required"`
	HappeningID      string     `json:"happeningId" validate:"required"`
	Status           string     `json:"status" validate:"required"`
	UnregisterReason *string    `json:"unregisterReason" validate:"required"`
	CreatedAt        time.Time  `json:"createdAt" validate:"required"`
	PrevStatus       *string    `json:"prevStatus" validate:"required"`
	ChangedAt        *time.Time `json:"changedAt" validate:"required"`
	ChangedBy        *string    `json:"changedBy" validate:"required"`
	UserName         *string    `json:"userName" validate:"required"`
	UserHasImage     bool       `json:"userHasImage" validate:"required"`
}

// HappeningRegistrationListFromPorts converts a slice of port.HappeningRegistration to DTOs.
func HappeningRegistrationListFromPorts(registrations []model.HappeningRegistration) []HappeningRegistrationResponse {
	dtos := make([]HappeningRegistrationResponse, len(registrations))
	for i, reg := range registrations {
		dtos[i] = HappeningRegistrationResponse{
			UserID:           reg.UserID,
			HappeningID:      reg.HappeningID,
			Status:           string(reg.Status),
			UnregisterReason: reg.UnregisterReason,
			CreatedAt:        reg.CreatedAt,
			PrevStatus:       reg.PrevStatus,
			ChangedAt:        reg.ChangedAt,
			ChangedBy:        reg.ChangedBy,
			UserName:         reg.UserName,
			UserHasImage:     reg.UserHasImage,
		}
	}
	return dtos
}
