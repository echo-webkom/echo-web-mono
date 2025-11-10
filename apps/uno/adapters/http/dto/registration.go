package dto

type GroupedRegistration struct {
	Waiting    int  `json:"waiting"`
	Registered int  `json:"registered"`
	Max        *int `json:"max"`
}
