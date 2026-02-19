package api

import (
	"database/sql"
	"errors"
	"net/http"
	"time"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/handler"
	"uno/http/router"
)

type users struct {
	logger      port.Logger
	userService *service.UserService
}

func NewUsersMux(logger port.Logger, userService *service.UserService, admin handler.Middleware) *router.Mux {
	u := users{logger, userService}

	mux := router.NewMux()

	mux.Handle("GET", "/", u.GetUsersHandler, admin)
	mux.Handle("GET", "/{id}", u.GetUserByIDHandler, admin)

	return mux
}

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

// GetUsersHandler returns a list of all users
// @Summary	     Gets a list of all users
// @Tags         users
// @Success      200  {array}   UserResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Produce	     json
// @Router       /users [get]
func (u *users) GetUsersHandler(ctx *handler.Context) error {
	// Get all users from the database
	users, err := u.userService.UserRepo().GetAllUsers(ctx.Context())
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Map users to user responses
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

	return ctx.JSON(userResponses)
}

// GetUserByIDHandler returns a user by ID
// @Summary	     Gets a user by ID
// @Tags         users
// @Param        id   path      string  true  "User ID"
// @Produces      json
// @Success      200  {object}  UserResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "User Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Produce	     json
// @Router       /users/{id} [get]
func (u *users) GetUserByIDHandler(ctx *handler.Context) error {
	// Get user ID from path parameters
	userID := ctx.PathValue("id")
	if userID == "" {
		return ctx.Error(errors.New("user ID is required"), http.StatusBadRequest)
	}

	// Get user from the database
	user, err := u.userService.UserRepo().GetUserByID(ctx.Context(), userID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Error(errors.New("user not found"), http.StatusNotFound)
		}
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Map user to user response
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

	userResponse := UserResponse{
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
	}

	return ctx.JSON(userResponse)
}
