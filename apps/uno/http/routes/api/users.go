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
	mux.Handle("GET", "/{id}/image", u.getUserImage)
	mux.Handle("POST", "/{id}/image", u.uploadUserImage, admin)
	mux.Handle("DELETE", "/{id}/image", u.deleteUserImage, admin)

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

// getUserImage returns a user's profile image
// @Summary	     Gets a user's profile image
// @Tags         users
// @Param        id   path      string  true  "User ID"
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
		return ctx.Error(errors.New("user ID is required"), http.StatusBadRequest)
	}

	// Get user image from the database
	pic, err := u.userService.GetProfilePicture(ctx.Context(), userID)
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// no-cache forces the browser to revalidate on every request using If-None-Match.
	// This ensures uploaded images are reflected immediately — the browser gets a 304
	// (no body) if the ETag matches, or the new image if it has changed.
	// We avoid max-age here because it would prevent revalidation until expiry, breaking
	// cache busting when a user uploads a new profile picture.
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
// @Router	   /users/{id}/image [post]
func (u *users) uploadUserImage(ctx *handler.Context) error {
	// Get user ID from path parameters
	userID := ctx.PathValue("id")
	if userID == "" {
		return ctx.Error(errors.New("user ID is required"), http.StatusBadRequest)
	}

	// Get the profile picture from the form data
	pic, err := profilePictureUploadFromContext(ctx)
	if err != nil {
		return ctx.Error(err, http.StatusBadRequest)
	}

	// Upload the user image to the database
	imageURL, err := u.userService.UploadProfileImage(ctx.Context(), userID, pic)
	if err != nil {
		if errors.Is(err, model.ErrProfilePictureTooLarge) {
			return ctx.Error(model.ErrProfilePictureTooLarge, http.StatusBadRequest)
		}
		if errors.Is(err, model.ErrUnsupportedProfilePictureType) {
			return ctx.Error(model.ErrUnsupportedProfilePictureType, http.StatusBadRequest)
		}
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Error(errors.New("user not found"), http.StatusNotFound)
		}
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Return 200 OK
	return ctx.Text(imageURL)
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
// @Router	   /users/{id}/image [delete]
func (u *users) deleteUserImage(ctx *handler.Context) error {
	// Get user ID from path parameters
	userID := ctx.PathValue("id")
	if userID == "" {
		return ctx.Error(errors.New("user ID is required"), http.StatusBadRequest)
	}

	// Delete the user image from the database
	err := u.userService.DeleteUserImage(ctx.Context(), userID)
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.Error(errors.New("user not found"), http.StatusNotFound)
		}
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Return 200 OK
	return nil
}
