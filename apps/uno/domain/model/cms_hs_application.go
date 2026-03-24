package model

import "encoding/json"

type CMSHSApplicationProfile struct {
	ID      string          `json:"_id"`
	Name    string          `json:"name"`
	Picture json.RawMessage `json:"picture"`
}

type CMSHSApplication struct {
	Profile *CMSHSApplicationProfile `json:"profile"`
	Poster  *string                  `json:"poster"`
}
