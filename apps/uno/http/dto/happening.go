package dto

import (
	"encoding/json"
	"time"

	"uno/domain/model"
)

// HappeningResponse represents the happening data returned in API responses.
type HappeningResponse struct {
	ID                      string           `json:"id" validate:"required"`
	Slug                    string           `json:"slug" validate:"required"`
	Title                   string           `json:"title" validate:"required"`
	Type                    string           `json:"type" validate:"required"`
	Date                    *time.Time       `json:"date" validate:"required"`
	RegistrationGroups      *json.RawMessage `json:"registrationGroups" validate:"required"`
	RegistrationStartGroups *time.Time       `json:"registrationStartGroups" validate:"required"`
	RegistrationStart       *time.Time       `json:"registrationStart" validate:"required"`
	RegistrationEnd         *time.Time       `json:"registrationEnd" validate:"required"`
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
	ID          string `json:"id" validate:"required"`
	HappeningID string `json:"happeningId" validate:"required"`
	Spots       int    `json:"spots" validate:"required"`
	MinYear     int    `json:"minYear" validate:"required"`
	MaxYear     int    `json:"maxYear" validate:"required"`
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
	ID          string           `json:"id" validate:"required"`
	Title       string           `json:"title" validate:"required"`
	Required    bool             `json:"required" validate:"required"`
	Type        string           `json:"type" validate:"required"`
	IsSensitive bool             `json:"isSensitive" validate:"required"`
	Options     *json.RawMessage `json:"options" validate:"required"`
	HappeningID string           `json:"happeningId" validate:"required"`
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
