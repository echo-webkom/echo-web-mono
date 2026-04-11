package model

type CMSTrophyCollection struct {
	ID              string      `json:"_id"`
	Title           string      `json:"title"`
	Slug            string      `json:"slug"`
	BaseImage       Image       `json:"baseImage"`
	BaseDescription string      `json:"baseDescription"`
	Trophies        []CMSTrophy `json:"trophies"`
}

type CMSTrophy struct {
	Key         string `json:"_key"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Level       string `json:"level"`
	Image       Image  `json:"image"`
}