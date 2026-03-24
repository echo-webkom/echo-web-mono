package model

type CMSBanner struct {
	BackgroundColor *Color  `json:"backgroundColor"`
	TextColor       *Color  `json:"textColor"`
	Text            *string `json:"text"`
	ExpiringDate    *string `json:"expiringDate"`
	LinkTo          *string `json:"linkTo"`
	IsExternal      *bool   `json:"isExternal"`
}
