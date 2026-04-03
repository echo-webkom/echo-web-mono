package dto

import "uno/domain/service"

type SanityRevalidateRequest struct {
	Operation  string  `json:"operation"`
	DocumentID string  `json:"documentId"`
	Type       string  `json:"type"`
	Slug       *string `json:"slug"`
	PastSlug   *string `json:"pastSlug"`
}

type SanityWebhookRequest struct {
	Operation  string               `json:"operation"`
	DocumentID string               `json:"documentId"`
	PastSlug   *string              `json:"pastSlug"`
	Data       *SanityHappeningData `json:"data"`
}

type SanityHappeningData struct {
	ID                      string            `json:"_id"`
	Title                   string            `json:"title"`
	Slug                    string            `json:"slug"`
	Date                    string            `json:"date"`
	HappeningType           string            `json:"happeningType"`
	RegistrationStartGroups *string           `json:"registrationStartGroups"`
	RegistrationGroups      []string          `json:"registrationGroups"`
	RegistrationStart       *string           `json:"registrationStart"`
	RegistrationEnd         *string           `json:"registrationEnd"`
	Groups                  []string          `json:"groups"`
	SpotRanges              []SanitySpotRange `json:"spotRanges"`
	Questions               []SanityQuestion  `json:"questions"`
}

type SanitySpotRange struct {
	Spots   int `json:"spots"`
	MinYear int `json:"minYear"`
	MaxYear int `json:"maxYear"`
}

type SanityQuestion struct {
	ID          string   `json:"id"`
	Title       string   `json:"title"`
	Required    bool     `json:"required"`
	Type        string   `json:"type"`
	IsSensitive bool     `json:"isSensitive"`
	Options     []string `json:"options"`
}

func (d *SanityHappeningData) ToServiceData() service.SanityHappeningData {
	spotRanges := make([]service.SanitySpotRange, len(d.SpotRanges))
	for i, sr := range d.SpotRanges {
		spotRanges[i] = service.SanitySpotRange{
			Spots:   sr.Spots,
			MinYear: sr.MinYear,
			MaxYear: sr.MaxYear,
		}
	}

	questions := make([]service.SanityQuestion, len(d.Questions))
	for i, q := range d.Questions {
		questions[i] = service.SanityQuestion{
			ID:          q.ID,
			Title:       q.Title,
			Required:    q.Required,
			Type:        q.Type,
			IsSensitive: q.IsSensitive,
			Options:     q.Options,
		}
	}

	return service.SanityHappeningData{
		ID:                      d.ID,
		Title:                   d.Title,
		Slug:                    d.Slug,
		Date:                    d.Date,
		HappeningType:           d.HappeningType,
		RegistrationStartGroups: d.RegistrationStartGroups,
		RegistrationGroups:      d.RegistrationGroups,
		RegistrationStart:       d.RegistrationStart,
		RegistrationEnd:         d.RegistrationEnd,
		Groups:                  d.Groups,
		SpotRanges:              spotRanges,
		Questions:               questions,
	}
}
