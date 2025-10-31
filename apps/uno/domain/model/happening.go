package model

import (
	"encoding/json"
	"time"
)

type Happening struct {
	ID                      string           `db:"id" json:"id"`
	Slug                    string           `db:"slug" json:"slug"`
	Title                   string           `db:"title" json:"title"`
	Type                    string           `db:"type" json:"type"`
	Date                    *time.Time       `db:"date" json:"date"`
	RegistrationGroups      *json.RawMessage `db:"registration_groups" json:"registration_groups"`
	RegistrationStartGroups *time.Time       `db:"registration_start_groups" json:"registration_start_groups"`
	RegistrationStart       *time.Time       `db:"registration_start" json:"registration_start"`
	RegistrationEnd         *time.Time       `db:"registration_end" json:"registration_end"`
}

type HappeningsToGroups struct {
	HappeningID string `db:"happening_id" json:"happening_id"`
	GroupID     string `db:"group_id" json:"group_id"`
}

type SpotRange struct {
	ID          string `db:"id" json:"id"`
	HappeningID string `db:"happening_id" json:"happening_id"`
	Spots       int    `db:"spots" json:"spots"`
	MinYear     int    `db:"min_year" json:"min_year"`
	MaxYear     int    `db:"max_year" json:"max_year"`
}

type Question struct {
	ID          string           `db:"id" json:"id"`
	Title       string           `db:"title" json:"title"`
	Required    bool             `db:"required" json:"required"`
	Type        string           `db:"type" json:"type"`
	IsSensitive bool             `db:"is_sensitive" json:"is_sensitive"`
	Options     *json.RawMessage `db:"options" json:"options"`
	HappeningID string           `db:"happening_id" json:"happening_id"`
}

type Answer struct {
	UserID      string           `db:"user_id" json:"user_id"`
	HappeningID string           `db:"happening_id" json:"happening_id"`
	QuestionID  string           `db:"question_id" json:"question_id"`
	Answer      *json.RawMessage `db:"answer" json:"answer"`
}
