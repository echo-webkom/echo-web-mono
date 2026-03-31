package model

type CMSJobLocation struct {
	ID   string `json:"_id"`
	Name string `json:"name"`
}

type CMSDegreeYears struct {
	First  *bool `json:"FIRST"`
	Second *bool `json:"SECOND"`
	Third  *bool `json:"THIRD"`
	Fourth *bool `json:"FOURTH"`
	Fifth  *bool `json:"FIFTH"`
	PhD    *bool `json:"PHD"`
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
	DegreeYears *CMSDegreeYears  `json:"degreeYears"`
	Body        *string          `json:"body"`
}
