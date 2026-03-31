package model

type CMSLocation struct {
	Name string `json:"name"`
	Link string `json:"link"`
}

type CMSCompany struct {
	ID      string `json:"_id"`
	Name    string `json:"name"`
	Website string `json:"website"`
	Image   Image  `json:"image"`
}

type CMSSpotRange struct {
	Spots   int `json:"spots"`
	MinYear int `json:"minYear"`
	MaxYear int `json:"maxYear"`
}

type CMSAdditionalQuestion struct {
	ID       string   `json:"id"`
	Title    string   `json:"title"`
	Required bool     `json:"required"`
	Type     string   `json:"type"`
	Options  []string `json:"options"`
}

type CMSOrganizerRef struct {
	ID   string `json:"_id"`
	Name string `json:"name"`
	Slug string `json:"slug"`
}

type CMSContactProfile struct {
	ID   string `json:"_id"`
	Name string `json:"name"`
}

type CMSContact struct {
	Email   string            `json:"email"`
	Profile CMSContactProfile `json:"profile"`
}

type CMSHappening struct {
	ID                      string                  `json:"_id"`
	CreatedAt               string                  `json:"_createdAt"`
	UpdatedAt               string                  `json:"_updatedAt"`
	Type                    string                  `json:"_type"`
	Title                   string                  `json:"title"`
	Slug                    string                  `json:"slug"`
	IsPinned                *bool                   `json:"isPinned"`
	HappeningType           string                  `json:"happeningType"`
	HideRegistrations       *bool                   `json:"hideRegistrations"`
	Company                 *CMSCompany             `json:"company"`
	Organizers              []CMSOrganizerRef       `json:"organizers"`
	Contacts                []CMSContact            `json:"contacts"`
	Date                    *string                 `json:"date"`
	EndDate                 *string                 `json:"endDate"`
	Cost                    *int                    `json:"cost"`
	RegistrationStartGroups *string                 `json:"registrationStartGroups"`
	RegistrationGroups      []string                `json:"registrationGroups"`
	RegistrationStart       *string                 `json:"registrationStart"`
	RegistrationEnd         *string                 `json:"registrationEnd"`
	Location                *CMSLocation            `json:"location"`
	SpotRanges              []CMSSpotRange          `json:"spotRanges"`
	AdditionalQuestions     []CMSAdditionalQuestion `json:"additionalQuestions"`
	ExternalLink            *string                 `json:"externalLink"`
	Body                    *string                 `json:"body"`
}

type CMSHappeningType struct {
	HappeningType string `json:"happeningType"`
}

type CMSHomeHappening struct {
	ID                string   `json:"_id"`
	Title             string   `json:"title"`
	IsPinned          *bool    `json:"isPinned"`
	HappeningType     string   `json:"happeningType"`
	Date              *string  `json:"date"`
	RegistrationStart *string  `json:"registrationStart"`
	Slug              string   `json:"slug"`
	Image             Image    `json:"image"`
	Organizers        []string `json:"organizers"`
}
