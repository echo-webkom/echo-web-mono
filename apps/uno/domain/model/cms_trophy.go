package model

type CMSTrophy struct {
	Image        Image  `json:"image"`
	Text         string `json:"text"`
	AmountNeeded int    `json:"amount_needed"`
}

type CMSTrophyCollection struct {
	ID       string       `json:"_id"`
	Title    string       `json:"title"`
	Trophies []CMSTrophy `json:"trophies"`
}
