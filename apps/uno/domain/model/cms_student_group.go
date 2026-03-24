package model

import "encoding/json"

type CMSProfileSocials struct {
	Facebook  *string `json:"facebook"`
	Instagram *string `json:"instagram"`
	LinkedIn  *string `json:"linkedin"`
	Email     *string `json:"email"`
}

type CMSMemberProfile struct {
	ID      string             `json:"_id"`
	Name    string             `json:"name"`
	Picture json.RawMessage    `json:"picture"`
	Socials *CMSProfileSocials `json:"socials"`
}

type CMSMember struct {
	Role    string           `json:"role"`
	Profile CMSMemberProfile `json:"profile"`
}

type CMSStudentGroupSocials struct {
	Facebook  *string `json:"facebook"`
	Instagram *string `json:"instagram"`
	LinkedIn  *string `json:"linkedin"`
	Email     *string `json:"email"`
}

type CMSStudentGroup struct {
	ID          string                  `json:"_id"`
	CreatedAt   string                  `json:"_createdAt"`
	UpdatedAt   string                  `json:"_updatedAt"`
	Name        string                  `json:"name"`
	IsActive    *bool                   `json:"isActive"`
	GroupType   string                  `json:"groupType"`
	Slug        string                  `json:"slug"`
	Description *string                 `json:"description"`
	Image       json.RawMessage         `json:"image"`
	Members     []CMSMember             `json:"members"`
	Socials     *CMSStudentGroupSocials  `json:"socials"`
}
