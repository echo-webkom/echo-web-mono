package dto

import (
	"time"
	"uno/domain/model"
)

type UserSearchResult struct {
	ID   string  `json:"id"`
	Name *string `json:"name"`
}

type UserGroupResponse struct {
	Name     string `json:"name" validate:"required"`
	ID       string `json:"id" validate:"required"`
	IsLeader bool   `json:"isLeader" validate:"required"`
}

type UserResponse struct {
	ID               string              `json:"id" validate:"required"`
	Name             *string             `json:"name" validate:"required"`
	Email            string              `json:"email" validate:"required"`
	HasImage         bool                `json:"hasImage" validate:"required"`
	AlternativeEmail *string             `json:"alternativeEmail" validate:"required"`
	Degree           *DegreeResponse     `json:"degree" validate:"required"`
	Year             *int                `json:"year" validate:"required"`
	Type             string              `json:"type" validate:"required"`
	LastSignInAt     *time.Time          `json:"lastSignInAt" validate:"required"`
	UpdatedAt        *time.Time          `json:"updatedAt" validate:"required"`
	CreatedAt        *time.Time          `json:"createdAt" validate:"required"`
	HasReadTerms     bool                `json:"hasReadTerms" validate:"required"`
	Birthday         *time.Time          `json:"birthday" validate:"required"`
	IsPublic         bool                `json:"isPublic" validate:"required"`
	Groups           []UserGroupResponse `json:"groups" validate:"required"`
}

func UsersToUserResponses(users []model.User) []UserResponse {
	var userResponses []UserResponse
	for _, user := range users {
		var degreeResponse *DegreeResponse
		if user.Degree != nil {
			degreeResponse = &DegreeResponse{
				ID:   user.Degree.ID,
				Name: user.Degree.Name,
			}
		}

		groups := make([]UserGroupResponse, len(user.Groups))
		for i, group := range user.Groups {
			groups[i] = UserGroupResponse{
				Name:     group.Name,
				ID:       group.ID,
				IsLeader: group.IsLeader,
			}
		}

		userResponses = append(userResponses, UserResponse{
			ID:               user.ID,
			Name:             user.Name,
			Email:            user.Email,
			HasImage:         user.HasImage,
			AlternativeEmail: user.AlternativeEmail,
			Degree:           degreeResponse,
			Year:             user.Year.IntPtr(),
			Type:             user.Type.String(),
			LastSignInAt:     user.LastSignInAt,
			UpdatedAt:        user.UpdatedAt,
			CreatedAt:        user.CreatedAt,
			HasReadTerms:     user.HasReadTerms,
			Birthday:         user.Birthday,
			IsPublic:         user.IsPublic,
			Groups:           groups,
		})
	}
	return userResponses
}
