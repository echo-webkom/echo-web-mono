package model

type CMSBanner struct {
	BackgroundColor *string `json:"backgroundColor"`
	TextColor       *string `json:"textColor"`
	Text            *string `json:"text"`
	ExpiringDate    *string `json:"expiringDate"`
	LinkTo          *string `json:"linkTo"`
	IsExternal      *bool   `json:"isExternal"`
}
