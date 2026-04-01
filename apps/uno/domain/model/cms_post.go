package model

type CMSAuthor struct {
	ID    string `json:"_id"`
	Name  string `json:"name"`
	Image Image  `json:"image"`
}

type CMSPost struct {
	ID        string      `json:"_id"`
	CreatedAt string      `json:"_createdAt"`
	UpdatedAt string      `json:"_updatedAt"`
	Title     string      `json:"title"`
	Slug      string      `json:"slug"`
	Authors   []CMSAuthor `json:"authors"`
	Image     Image       `json:"image"`
	Body      string      `json:"body"`
}
