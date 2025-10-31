package model

import (
	"encoding/json"
	"time"
)

type Happening struct {
	ID                      string           `db:"id"`
	Slug                    string           `db:"slug"`
	Title                   string           `db:"title"`
	Type                    string           `db:"type"`
	Date                    *time.Time       `db:"date"`
	RegistrationGroups      *json.RawMessage `db:"registration_groups"`
	RegistrationStartGroups *time.Time       `db:"registration_start_groups"`
	RegistrationStart       *time.Time       `db:"registration_start"`
	RegistrationEnd         *time.Time       `db:"registration_end"`
}

type HappeningsToGroups struct {
	HappeningID string `db:"happening_id"`
	GroupID     string `db:"group_id"`
}

type SpotRange struct {
	ID          string `db:"id"`
	HappeningID string `db:"happening_id"`
	Spots       int    `db:"spots"`
	MinYear     int    `db:"min_year"`
	MaxYear     int    `db:"max_year"`
}

type Question struct {
	ID          string           `db:"id"`
	Title       string           `db:"title"`
	Required    bool             `db:"required"`
	Type        string           `db:"type"`
	IsSensitive bool             `db:"is_sensitive"`
	Options     *json.RawMessage `db:"options"`
	HappeningID string           `db:"happening_id"`
}

type Answer struct {
	UserID      string           `db:"user_id"`
	HappeningID string           `db:"happening_id"`
	QuestionID  string           `db:"question_id"`
	Answer      *json.RawMessage `db:"answer"`
}
