package dto

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
