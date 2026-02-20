package happening

import (
	"encoding/json"
	"time"

	"uno/domain/model"
)

// HappeningResponse represents the happening data returned in API responses.
type HappeningResponse struct {
	ID                      string           `json:"id"`
	Slug                    string           `json:"slug"`
	Title                   string           `json:"title"`
	Type                    string           `json:"type"`
	Date                    *time.Time       `json:"date"`
	RegistrationGroups      *json.RawMessage `json:"registrationGroups"`
	RegistrationStartGroups *time.Time       `json:"registrationStartGroups"`
	RegistrationStart       *time.Time       `json:"registrationStart"`
	RegistrationEnd         *time.Time       `json:"registrationEnd"`
}

// FromDomain converts a domain Happening model to a HappeningResponse DTO.
func (dto *HappeningResponse) FromDomain(h *model.Happening) *HappeningResponse {
	return &HappeningResponse{
		ID:                      h.ID,
		Slug:                    h.Slug,
		Title:                   h.Title,
		Type:                    h.Type.String(),
		Date:                    h.Date,
		RegistrationGroups:      h.RegistrationGroups,
		RegistrationStartGroups: h.RegistrationStartGroups,
		RegistrationStart:       h.RegistrationStart,
		RegistrationEnd:         h.RegistrationEnd,
	}
}

// HappeningListFromDomain converts a slice of domain Happening models to HappeningResponse DTOs.
func HappeningListFromDomain(happenings []model.Happening) []HappeningResponse {
	dtos := make([]HappeningResponse, len(happenings))
	for i, happening := range happenings {
		dtos[i] = *(&HappeningResponse{}).FromDomain(&happening)
	}
	return dtos
}

// SpotRangeResponse represents the spot range data returned in API responses.
type SpotRangeResponse struct {
	ID          string `json:"id"`
	HappeningID string `json:"happeningId"`
	Spots       int    `json:"spots"`
	MinYear     int    `json:"minYear"`
	MaxYear     int    `json:"maxYear"`
}

// FromDomain converts a domain SpotRange model to a SpotRangeResponse DTO.
func (dto *SpotRangeResponse) FromDomain(sr *model.SpotRange) *SpotRangeResponse {
	return &SpotRangeResponse{
		ID:          sr.ID,
		HappeningID: sr.HappeningID,
		Spots:       sr.Spots,
		MinYear:     sr.MinYear,
		MaxYear:     sr.MaxYear,
	}
}

// SpotRangeListFromDomain converts a slice of domain SpotRange models to SpotRangeResponse DTOs.
func SpotRangeListFromDomain(spotRanges []model.SpotRange) []SpotRangeResponse {
	dtos := make([]SpotRangeResponse, len(spotRanges))
	for i, spotRange := range spotRanges {
		dtos[i] = *(&SpotRangeResponse{}).FromDomain(&spotRange)
	}
	return dtos
}

// QuestionResponse represents the question data returned in API responses.
type QuestionResponse struct {
	ID          string           `json:"id"`
	Title       string           `json:"title"`
	Required    bool             `json:"required"`
	Type        string           `json:"type"`
	IsSensitive bool             `json:"isSensitive"`
	Options     *json.RawMessage `json:"options"`
	HappeningID string           `json:"happeningId"`
}

// FromDomain converts a domain Question model to a QuestionResponse DTO.
func (dto *QuestionResponse) FromDomain(q *model.Question) *QuestionResponse {
	return &QuestionResponse{
		ID:          q.ID,
		Title:       q.Title,
		Required:    q.Required,
		Type:        q.Type,
		IsSensitive: q.IsSensitive,
		Options:     q.Options,
		HappeningID: q.HappeningID,
	}
}

// QuestionListFromDomain converts a slice of domain Question models to QuestionResponse DTOs.
func QuestionListFromDomain(questions []model.Question) []QuestionResponse {
	dtos := make([]QuestionResponse, len(questions))
	for i, question := range questions {
		dtos[i] = *(&QuestionResponse{}).FromDomain(&question)
	}
	return dtos
}

// RegistrationResponse represents the registration data returned in API responses.
type RegistrationResponse struct {
	UserID           string     `json:"userId"`
	HappeningID      string     `json:"happeningId"`
	Status           string     `json:"status"`
	UnregisterReason *string    `json:"unregisterReason,omitempty"`
	CreatedAt        time.Time  `json:"createdAt"`
	PrevStatus       *string    `json:"prevStatus,omitempty"`
	ChangedAt        *time.Time `json:"changedAt,omitempty"`
	ChangedBy        *string    `json:"changedBy,omitempty"`
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
	UserID    string              `json:"userId"`
	Questions []QuestionAnswerDTO `json:"questions"`
}

// QuestionAnswerDTO represents a question answer in the HTTP request/response.
type QuestionAnswerDTO struct {
	QuestionID string          `json:"questionId"`
	Answer     json.RawMessage `json:"answer"`
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
	Success      bool   `json:"success"`
	Message      string `json:"message"`
	IsWaitlisted bool   `json:"isWaitlisted"`
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
	HappeningID string `json:"happeningId"`
	Waiting     int    `json:"waiting"`
	Registered  int    `json:"registered"`
	Max         *int   `json:"max"`
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
	IsRegistered bool   `json:"isRegistered"`
	IsWaitlisted bool   `json:"isWaitlisted"`
	Status       string `json:"status"`
}

// HappeningRegistrationResponse represents the registration data with user info returned in API responses.
type HappeningRegistrationResponse struct {
	UserID           string     `json:"userId"`
	HappeningID      string     `json:"happeningId"`
	Status           string     `json:"status"`
	UnregisterReason *string    `json:"unregisterReason"`
	CreatedAt        time.Time  `json:"createdAt"`
	PrevStatus       *string    `json:"prevStatus"`
	ChangedAt        *time.Time `json:"changedAt"`
	ChangedBy        *string    `json:"changedBy"`
	UserName         *string    `json:"userName"`
	UserImage        *string    `json:"userImage"`
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
			UserImage:        reg.UserImage,
		}
	}
	return dtos
}
