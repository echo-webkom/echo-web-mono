package api

import (
	"database/sql"
	"errors"
	"net/http"
	"uno/domain/model"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
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

	mux.Handle("GET", "/", u.getUsers, admin)
	mux.Handle("GET", "/{id}", u.getUserByID, admin)

	return mux
}

// getUsers returns a list of all users
// @Summary	     Gets a list of all users
// @Tags         users
// @Success      200  {array}   dto.UserResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Produce	     json
// @Router       /users [get]
func (u *users) getUsers(ctx *handler.Context) error {
	// Get all users from the database
	users, err := u.userService.UserRepo().GetAllUsers(ctx.Context())
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Map users to user responses
	userResponses := dto.UsersToUserResponses(users)
	return ctx.JSON(userResponses)
}

// getUserByID returns a user by ID
// @Summary	     Gets a user by ID
// @Tags         users
// @Param        id   path      string  true  "User ID"
// @Produces     json
// @Success      200  {object}  dto.UserResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "User Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Produce	     json
// @Router       /users/{id} [get]
func (u *users) getUserByID(ctx *handler.Context) error {
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
	userResponses := dto.UsersToUserResponses([]model.User{user})
	if len(userResponses) == 0 {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}
	return ctx.JSON(userResponses[0])
}
