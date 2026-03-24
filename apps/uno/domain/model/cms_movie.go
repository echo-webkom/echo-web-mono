package model

type CMSMovie struct {
	ID    string  `json:"_id"`
	Title string  `json:"title"`
	Date  *string `json:"date"`
	Link  *string `json:"link"`
	Image Image   `json:"image"`
}
