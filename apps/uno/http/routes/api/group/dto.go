package group

import "uno/domain/model"

// GroupResponse represents a generic response for group-related operations.
type GroupResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// CreateGroupRequest represents the request body for creating a new group.
type CreateGroupRequest struct {
	ID   *string `json:"id"`
	Name string  `json:"name" validate:"required"`
}

// ToNewGroupDomain converts the CreateGroupRequest to a NewGroup domain model.
func (r *CreateGroupRequest) ToNewGroupDomain() model.NewGroup {
	return model.NewGroup{
		ID:   r.ID,
		Name: r.Name,
	}
}

type UpdateGroupRequest struct {
	Name string `json:"name" validate:"required"`
}
