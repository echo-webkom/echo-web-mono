package model

import (
	"encoding/json"
	"time"
)

type RegistrationCount struct {
	HappeningID string
	Max         *int
	Waiting     int
	Registered  int
}

type Happening struct {
	ID                      string
	Slug                    string
	Title                   string
	Type                    HappeningType
	Date                    *time.Time
	RegistrationGroups      *json.RawMessage
	RegistrationStartGroups *time.Time
	RegistrationStart       *time.Time
	RegistrationEnd         *time.Time
}

func (h *Happening) IsBedpres() bool {
	return h.Type == HappeningTypeBedpres
}

type HappeningType string

const (
	HappeningTypeEvent   HappeningType = "event"
	HappeningTypeBedpres HappeningType = "bedpres"
)

func (h HappeningType) String() string {
	return string(h)
}

type HappeningsToGroups struct {
	HappeningID string
	GroupID     string
}

type SpotRange struct {
	ID          string
	HappeningID string
	Spots       int
	MinYear     int
	MaxYear     int
}

type Question struct {
	ID          string
	Title       string
	Required    bool
	Type        string
	IsSensitive bool
	Options     *json.RawMessage
	HappeningID string
}

type Answer struct {
	UserID      string
	HappeningID string
	QuestionID  string
	Answer      *json.RawMessage
}

// QuestionAnswer represents an answer to a question in a registration request
type QuestionAnswer struct {
	QuestionID string
	Answer     json.RawMessage // Can be string or []string
}

type HappeningRegistration struct {
	UserID           string
	HappeningID      string
	Status           RegistrationStatus
	UnregisterReason *string
	CreatedAt        time.Time
	PrevStatus       *string
	ChangedAt        *time.Time
	ChangedBy        *string
	UserName         *string
	UserImage        *string
}
