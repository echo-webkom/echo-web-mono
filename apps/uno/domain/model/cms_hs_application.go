package model

type CMSHSApplicationProfile struct {
	ID      string `json:"_id"`
	Name    string `json:"name"`
	Picture Image  `json:"picture"`
}

type CMSHSApplication struct {
	Profile *CMSHSApplicationProfile `json:"profile"`
	Poster  *string                  `json:"poster"`
}
