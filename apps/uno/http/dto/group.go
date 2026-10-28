package dto

import (
	"time"
	"uno/domain/model"
)

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

// UpdateGroupMemberLeaderRequest represents the request body for updating a group member leader status.
type UpdateGroupMemberLeaderRequest struct {
	Leader bool `json:"leader"`
}

// AddGroupMemberRequest represents the request body for adding a user to a group.
type AddGroupMemberRequest struct {
	UserID string `json:"userId"`
}

type CreateIntgroupRequestRequest struct {
	GroupName           string  `json:"groupName" validate:"required"`
	Description         string  `json:"description" validate:"required"`
	InterestedPeople    string  `json:"interestedPeople" validate:"required"`
	Purpose             string  `json:"purpose" validate:"required"`
	NeedsFromHovedstyre *string `json:"needsFromHovedstyre"`
	ContactEmail        string  `json:"contactEmail" validate:"required,email"`
}

func (r *CreateIntgroupRequestRequest) ToDomain() model.NewIntgroupRequest {
	return model.NewIntgroupRequest{
		GroupName:           r.GroupName,
		Description:         r.Description,
		InterestedPeople:    r.InterestedPeople,
		Purpose:             r.Purpose,
		NeedsFromHovedstyre: r.NeedsFromHovedstyre,
		ContactEmail:        r.ContactEmail,
	}
}

type IntgroupRequestResponse struct {
	ID                  string    `json:"id"`
	GroupName           string    `json:"groupName"`
	Description         string    `json:"description"`
	InterestedPeople    string    `json:"interestedPeople"`
	Purpose             string    `json:"purpose"`
	NeedsFromHovedstyre *string   `json:"needsFromHovedstyre"`
	ContactEmail        string    `json:"contactEmail"`
	CreatedAt           time.Time `json:"createdAt"`
}

func IntgroupRequestResponseFromDomain(request model.IntgroupRequest) IntgroupRequestResponse {
	return IntgroupRequestResponse{
		ID:                  request.ID,
		GroupName:           request.GroupName,
		Description:         request.Description,
		InterestedPeople:    request.InterestedPeople,
		Purpose:             request.Purpose,
		NeedsFromHovedstyre: request.NeedsFromHovedstyre,
		ContactEmail:        request.ContactEmail,
		CreatedAt:           request.CreatedAt,
	}
}

func IntgroupRequestResponsesFromDomain(requests []model.IntgroupRequest) []IntgroupRequestResponse {
	response := make([]IntgroupRequestResponse, len(requests))
	for i, request := range requests {
		response[i] = IntgroupRequestResponseFromDomain(request)
	}
	return response
}
