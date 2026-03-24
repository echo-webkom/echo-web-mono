package model

import "encoding/json"

type CMSJobLocation struct {
	ID   string `json:"_id"`
	Name string `json:"name"`
}

type CMSJobAd struct {
	ID          string           `json:"_id"`
	CreatedAt   string           `json:"_createdAt"`
	UpdatedAt   string           `json:"_updatedAt"`
	Weight      *int             `json:"weight"`
	Title       string           `json:"title"`
	Slug        string           `json:"slug"`
	Company     *CMSCompany      `json:"company"`
	ExpiresAt   *string          `json:"expiresAt"`
	Locations   []CMSJobLocation `json:"locations"`
	JobType     *string          `json:"jobType"`
	Link        *string          `json:"link"`
	Deadline    *string          `json:"deadline"`
	DegreeYears []int            `json:"degreeYears"`
	Body        json.RawMessage  `json:"body"`
}
