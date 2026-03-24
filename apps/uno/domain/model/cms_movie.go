package model

import "encoding/json"

type CMSMovie struct {
	ID    string          `json:"_id"`
	Title string          `json:"title"`
	Date  *string         `json:"date"`
	Link  *string         `json:"link"`
	Image json.RawMessage `json:"image"`
}
