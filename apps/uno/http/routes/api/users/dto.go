package users

import (
	"time"
	"uno/domain/model"
)

// DegreeResponse represents the response payload for a degree.
type DegreeResponse struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}

type UserGroupResponse struct {
	Name     string `json:"name"`
	ID       string `json:"id"`
	IsLeader bool   `json:"isLeader"`
}

type UserResponse struct {
	ID               string              `json:"id"`
	Name             *string             `json:"name"`
	Email            string              `json:"email"`
	Image            *string             `json:"image"`
	AlternativeEmail *string             `json:"alternativeEmail"`
	Degree           *DegreeResponse     `json:"degree"`
	Year             *int                `json:"year"`
	Type             string              `json:"type"`
	LastSignInAt     *time.Time          `json:"lastSignInAt"`
	UpdatedAt        *time.Time          `json:"updatedAt"`
	CreatedAt        *time.Time          `json:"createdAt"`
	HasReadTerms     bool                `json:"hasReadTerms"`
	Birthday         *time.Time          `json:"birthday"`
	IsPublic         bool                `json:"isPublic"`
	Groups           []UserGroupResponse `json:"groups"`
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
			Image:            user.Image,
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
