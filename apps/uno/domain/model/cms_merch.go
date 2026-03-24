package model

import "encoding/json"

type CMSMerch struct {
	ID        string          `json:"_id"`
	CreatedAt string          `json:"_createdAt"`
	UpdatedAt string          `json:"_updatedAt"`
	Title     string          `json:"title"`
	Slug      string          `json:"slug"`
	Price     *int            `json:"price"`
	Image     json.RawMessage `json:"image"`
	Body      json.RawMessage `json:"body"`
}
