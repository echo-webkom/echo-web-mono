package model

import (
	"encoding/json"
	"time"
)

// TODO: remove json and db tags, replace with /postgres/models and /api/dto models

type Happening struct {
	ID                      string           `db:"id" json:"id"`
	Slug                    string           `db:"slug" json:"slug"`
	Title                   string           `db:"title" json:"title"`
	Type                    string           `db:"type" json:"type"`
	Date                    *time.Time       `db:"date" json:"date"`
	RegistrationGroups      *json.RawMessage `db:"registration_groups" json:"registrationGroups"`
	RegistrationStartGroups *time.Time       `db:"registration_start_groups" json:"registrationStartGroups"`
	RegistrationStart       *time.Time       `db:"registration_start" json:"registrationStart"`
	RegistrationEnd         *time.Time       `db:"registration_end" json:"registrationEnd"`
}

func (h *Happening) IsBedpres() bool {
	return h.Type == "bedpres"
}

type HappeningsToGroups struct {
	HappeningID string `db:"happening_id" json:"happeningId"`
	GroupID     string `db:"group_id" json:"groupId"`
}

type SpotRange struct {
	ID          string `db:"id" json:"id"`
	HappeningID string `db:"happening_id" json:"happeningId"`
	Spots       int    `db:"spots" json:"spots"`
	MinYear     int    `db:"min_year" json:"minYear"`
	MaxYear     int    `db:"max_year" json:"maxYear"`
}

type Question struct {
	ID          string           `db:"id" json:"id"`
	Title       string           `db:"title" json:"title"`
	Required    bool             `db:"required" json:"required"`
	Type        string           `db:"type" json:"type"`
	IsSensitive bool             `db:"is_sensitive" json:"isSensitive"`
	Options     *json.RawMessage `db:"options" json:"options"`
	HappeningID string           `db:"happening_id" json:"happeningId"`
}

type Answer struct {
	UserID      string           `db:"user_id" json:"userId"`
	HappeningID string           `db:"happening_id" json:"happeningId"`
	QuestionID  string           `db:"question_id" json:"questionId"`
	Answer      *json.RawMessage `db:"answer" json:"answer"`
}

// QuestionAnswer represents an answer to a question in a registration request
type QuestionAnswer struct {
	QuestionID string          `json:"questionId"`
	Answer     json.RawMessage `json:"answer"` // Can be string or []string
}
