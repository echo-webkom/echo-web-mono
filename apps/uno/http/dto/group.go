package dto

import "uno/domain/model"

// GroupResponse represents a generic response for group-related operations.
type GroupResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

// GroupResponseFromDomain converts a slice of domain Group models to GroupResponse DTOs.
func GroupResponseFromDomain(groups []model.Group) []GroupResponse {
	response := make([]GroupResponse, len(groups))
	for i, g := range groups {
		response[i] = GroupResponse{
			ID:   g.ID,
			Name: g.Name,
		}
	}
	return response
}

// GroupMemberResponse represents a member of a group.
type GroupMemberResponse struct {
	ID       string  `json:"id"`
	Name     *string `json:"name"`
	Email    string  `json:"email"`
	IsLeader bool    `json:"isLeader"`
}

// GroupMemberResponseFromDomain converts a slice of domain GroupMember models to GroupMemberResponse DTOs.
func GroupMemberResponseFromDomain(members []model.GroupMember) []GroupMemberResponse {
	response := make([]GroupMemberResponse, len(members))
	for i, m := range members {
		response[i] = GroupMemberResponse{
			ID:       m.ID,
			Name:     m.Name,
			Email:    m.Email,
			IsLeader: m.IsLeader,
		}
	}
	return response
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

// UpdateGroupRequest represents the request body for updating a group.
type UpdateGroupRequest struct {
	Name string `json:"name" validate:"required"`
}
