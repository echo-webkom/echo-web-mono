package api

type HealthCheckResponse struct {
	Status string `json:"status"`
}

type GroupedRegistration struct {
	Waiting    int  `json:"waiting"`
	Registered int  `json:"registered"`
	Max        *int `json:"max"`
}

type CreateDegreeRequest struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
