package model

import "encoding/json"

type CMSAuthor struct {
	ID    string          `json:"_id"`
	Name  string          `json:"name"`
	Image json.RawMessage `json:"image"`
}

type CMSPost struct {
	ID        string          `json:"_id"`
	CreatedAt string          `json:"_createdAt"`
	UpdatedAt string          `json:"_updatedAt"`
	Title     string          `json:"title"`
	Slug      string          `json:"slug"`
	Authors   []CMSAuthor     `json:"authors"`
	Image     json.RawMessage `json:"image"`
	Body      json.RawMessage `json:"body"`
}
