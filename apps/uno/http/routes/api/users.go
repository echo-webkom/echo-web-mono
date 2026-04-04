package api

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"uno/domain/model"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type users struct {
	logger           port.Logger
	userService      *service.UserService
	happeningService *service.HappeningService
}

func NewUsersMux(logger port.Logger, userService *service.UserService, happeningService *service.HappeningService, admin handler.Middleware, session handler.Middleware) *router.Mux {
	u := users{logger, userService, happeningService}

	mux := router.NewMux()

	// Public routes
	mux.Handle("GET", "/{id}/image", u.getUserImage)

	// Session routes
	mux.Handle("GET", "/search", u.searchUsers, session)

	// Admin routes
	mux.Handle("GET", "/", u.getUsers, admin)
	mux.Handle("GET", "/{id}", u.getUserByID, admin)
	mux.Handle("GET", "/{id}/registrations", u.getUserRegistrations, admin)
	mux.Handle("POST", "/{id}/image", u.uploadUserImage, admin)
	mux.Handle("DELETE", "/{id}/image", u.deleteUserImage, admin)
	mux.Handle("GET", "/feide/{feideId}/groups", u.getUserGroups, admin)

	return mux
}

// geUserGroups  gets the group IDs for a user based on the feide ID
// @Summary      Gets the group IDs for a user based on the feide ID
// @Tags         users
// @Param        feideId  path      string  true  "Feide ID"
// @Success      200      {array}   string  "OK"
// @Failure      400      {string}  string  "Bad Request"
// @Failure      401      {string}  string  "Unauthorized"
// @Failure      404      {string}  string  "User Not Found"
// @Failure      500      {string}  string  "Internal Server Error"
// @Produce	     json
// @Router       /users/feide/{feideId}/groups [get]
func (u *users) getUserGroups(ctx *handler.Context) error {
	// Get user ID from path parameters
	feideID := ctx.PathValue("feideId")
	if feideID == "" {
		return ctx.BadRequest(errors.New("missing feide ID"))
	}

	// Get group IDs for the user from the database
	groupIDs, err := u.userService.GetUserGroupIDs(ctx.Context(), feideID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.NotFound(errors.New("user not found"))
		}
		return ctx.InternalServerError()
	}

	return ctx.JSON(groupIDs)
}

// searchUsers searches for users by name
// @Summary	     Searches for users by name
// @Tags         users
// @Param        q   query     string  true  "Search query (minimum 2 characters)"
// @Success      200  {array}   dto.UserSearchResult  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Produce	     json
// @Security     BearerAuth
// @Router       /users/search [get]
func (u *users) searchUsers(ctx *handler.Context) error {
	query, _ := ctx.QueryParam("q")
	if len(query) < 2 {
		return ctx.JSON([]dto.UserSearchResult{})
	}

	users, err := u.userService.SearchUsersByName(ctx.Context(), query, 20)
	if err != nil {
		return ctx.InternalServerError()
	}

	results := make([]dto.UserSearchResult, 0, len(users))
	for _, user := range users {
		results = append(results, dto.UserSearchResult{
			ID:   user.ID,
			Name: user.Name,
		})
	}

	return ctx.JSON(results)
}

// getUsers returns a list of all users
// @Summary	     Gets a list of all users
// @Tags         users
// @Success      200  {array}   dto.UserResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Produce	     json
// @Security     AdminApiKey
// @Router       /users [get]
func (u *users) getUsers(ctx *handler.Context) error {
	// Get all users from the database
	users, err := u.userService.GetAllUsers(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
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
// @Security     AdminApiKey
// @Router       /users/{id} [get]
func (u *users) getUserByID(ctx *handler.Context) error {
	// Get user ID from path parameters
	userID := ctx.PathValue("id")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user ID"))
	}

	// Get user from the database
	user, err := u.userService.GetUserByID(ctx.Context(), userID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.NotFound(errors.New("user not found"))
		}
		return ctx.InternalServerError()
	}

	// Map user to user response
	userResponses := dto.UsersToUserResponses([]model.User{user})
	if len(userResponses) == 0 {
		return ctx.InternalServerError()
	}
	return ctx.JSON(userResponses[0])
}

// getUserImage returns a user's profile image
// @Summary	     Gets a user's profile image
// @Tags         users
// @Param        id   path      string  true  "User ID"
// @Query        size  query     int     false "Image size (1=small, 2=medium)"
// @Success      200  {string}  string  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "User Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Produce	     octet-stream
// @Router       /users/{id}/image [get]
func (u *users) getUserImage(ctx *handler.Context) error {
	// Get user ID from path parameters
	userID := ctx.PathValue("id")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user ID"))
	}

	size, _ := strconv.Atoi(ctx.R.URL.Query().Get("size"))

	// Get user image from the database
	pic, err := u.userService.GetProfilePicture(ctx.Context(), userID, size)
	if err != nil {
		if errors.Is(err, port.ErrNoProfilePicture) || errors.Is(err, service.ErrFileStorageNotConfigured) {
			return ctx.NotFound(port.ErrNoProfilePicture)
		}
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	ctx.SetHeader("ETag", pic.ETag)
	ctx.SetHeader("Cache-Control", "no-cache")
	ctx.SetHeader("Last-Modified", pic.LastModified.UTC().Format(http.TimeFormat))
	if ctx.R.Header.Get("If-None-Match") == pic.ETag {
		ctx.SetStatus(http.StatusNotModified)
		return nil
	}

	return ctx.Stream(pic)
}

// uploadUserImage uploads a user's profile image
// @Summary	     Uploads a user's profile image
// @Tags         users
// @Param        id   path      string  true  "User ID"
// @Param        file  formData  file    true  "Profile Image"
// @Success      200  {string}  string  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "User Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Produce	     json
// @Security     AdminApiKey
// @Router	   /users/{id}/image [post]
func (u *users) uploadUserImage(ctx *handler.Context) error {
	// Get user ID from path parameters
	userID := ctx.PathValue("id")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user ID"))
	}

	// Get the profile picture from the form data
	pic, err := profilePictureUploadFromContext(ctx)
	if err != nil {
		return ctx.BadRequest(errors.New("failed to read form body"))
	}

	// Upload the user image
	err = u.userService.UploadProfileImage(ctx.Context(), userID, pic)
	if err != nil {
		if errors.Is(err, model.ErrProfilePictureTooLarge) {
			return ctx.BadRequest(model.ErrProfilePictureTooLarge)
		}
		if errors.Is(err, model.ErrUnsupportedProfilePictureType) {
			return ctx.BadRequest(model.ErrUnsupportedProfilePictureType)
		}
		if errors.Is(err, model.ErrProfilePictureDimensionsTooLarge) {
			return ctx.BadRequest(model.ErrProfilePictureDimensionsTooLarge)
		}
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.NotFound(errors.New("user not found"))
		}
		u.logger.Error(ctx.Context(), "failed to upload profile picture", "userID", userID, "error", err)
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	return ctx.Ok()
}

// getUserRegistrations returns all registrations for a user
// @Summary	     Gets all registrations for a user
// @Tags         users
// @Param        id   path      string  true  "User ID"
// @Success      200  {array}   dto.UserRegistrationResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Produce	     json
// @Security     AdminApiKey
// @Router       /users/{id}/registrations [get]
func (u *users) getUserRegistrations(ctx *handler.Context) error {
	userID := ctx.PathValue("id")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user ID"))
	}

	registrations, err := u.happeningService.GetUserRegistrations(ctx.Context(), userID)
	if err != nil {
		return ctx.InternalServerError()
	}

	return ctx.JSON(dto.UserRegistrationsFromDomain(registrations))
}

// deleteUserImage deletes a user's profile image
// @Summary	     Deletes a user's profile image
// @Tags         users
// @Param        id   path      string  true  "User ID"
// @Success      200  {string}  string  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "User Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Produce	     json
// @Security     AdminApiKey
// @Router	   /users/{id}/image [delete]
func (u *users) deleteUserImage(ctx *handler.Context) error {
	// Get user ID from path parameters
	userID := ctx.PathValue("id")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user ID"))
	}

	// Delete the user image from the database
	err := u.userService.DeleteUserImage(ctx.Context(), userID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.BadRequest(errors.New("user not found"))
		}
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Return 200 OK
	return nil
}
