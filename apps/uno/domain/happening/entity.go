package happening

import (
	"encoding/json"
	"time"
)

type Happening struct {
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

func (h Happening) TableName() string {
	return "happening"
}
