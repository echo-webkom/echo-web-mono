package model

type CMSHSApplicationProfile struct {
	ID    string `json:"_id"`
	Name  string `json:"name"`
	Image Image  `json:"image"`
}

type CMSHSApplication struct {
	Profile *CMSHSApplicationProfile `json:"profile"`
	Poster  *string                  `json:"poster"`
}
