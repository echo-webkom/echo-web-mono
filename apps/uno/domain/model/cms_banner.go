package model

import "time"

type CMSBanner struct {
	BackgroundColor *Color  `json:"backgroundColor"`
	TextColor       *Color  `json:"textColor"`
	Text            *string `json:"text"`
	ExpiringDate    *string `json:"expiringDate"`
	LinkTo          *string `json:"linkTo"`
	IsExternal      *bool   `json:"isExternal"`
}

func (b *CMSBanner) HasExpired() bool {
	osloLoc, _ := time.LoadLocation("Europe/Oslo")
	if b.ExpiringDate == nil {
		return false
	}
	expiringDate, err := time.ParseInLocation(time.RFC3339, *b.ExpiringDate, osloLoc)
	if err != nil {
		return false
	}
	return time.Now().In(osloLoc).After(expiringDate)
}
