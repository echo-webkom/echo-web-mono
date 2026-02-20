package degree

import "uno/domain/model"

// CreateDegreeRequest represents the request payload for creating a new degree.
type CreateDegreeRequest struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// ToDomain converts CreateDegreeRequest DTO to domain model
func (dto *CreateDegreeRequest) ToDomain() *model.Degree {
	return &model.Degree{
		ID:   dto.ID,
		Name: dto.Name,
	}
}

// UpdateDegreeRequest represents the request payload for updating a degree.
type UpdateDegreeRequest struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// ToDomain converts UpdateDegreeRequest DTO to domain model
func (dto *UpdateDegreeRequest) ToDomain() *model.Degree {
	return &model.Degree{
		ID:   dto.ID,
		Name: dto.Name,
	}
}

// DegreeResponse represents the response payload for a degree.
type DegreeResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// DegreesFromDomainList converts a slice of domain models to DTOs
func DegreesFromDomainList(degrees []model.Degree) []DegreeResponse {
	response := make([]DegreeResponse, len(degrees))
	for i, d := range degrees {
		response[i] = DegreeResponse{
			ID:   d.ID,
			Name: d.Name,
		}
	}
	return response
}
