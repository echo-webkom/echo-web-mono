package api

import (
	"database/sql"
	"errors"
	"net/http"
	"strconv"
	"time"
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
	strikeService    *service.StrikeService
}

func NewUsersMux(logger port.Logger, userService *service.UserService, happeningService *service.HappeningService, strikeService *service.StrikeService, admin handler.Middleware, session handler.Middleware) *router.Mux {
	u := users{logger, userService, happeningService, strikeService}

	mux := router.NewMux()

	mux.GET("/", u.getUsers, admin)
	mux.GET("/search", u.searchUsers, session)
	mux.GET("/with-strikes", u.getUsersWithStrikeDetails, admin)

	mux.GET("/{id}", u.getUserByID, admin)
	mux.GET("/{id}/registrations", u.getUserRegistrations, admin)
	mux.GET("/{id}/strikes", u.getUserWithStrikeDetails, admin)
	mux.POST("/{id}/strikes", u.addStrike, admin)
	mux.DELETE("/{id}/strikes/{strikeId}", u.removeStrike, admin)
	mux.DELETE("/{id}/ban", u.removeBan, admin)

	mux.GET("/{id}/image", u.getUserImage)
	mux.POST("/{id}/image", u.uploadUserImage, admin)
	mux.DELETE("/{id}/image", u.deleteUserImage, admin)

	return mux
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
// @Param        id   path      string  true  "User ID or Feide ID"
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
	ID := ctx.PathValue("id")
	if ID == "" {
		return ctx.BadRequest(errors.New("missing user ID"))
	}

	// Get user from the database by ID, falling back to Feide ID
	user, err := u.userService.GetUserByID(ctx.Context(), ID)
	if errors.Is(err, sql.ErrNoRows) {
		user, err = u.userService.GetUserByFeideID(ctx.Context(), ID)
	}
	if err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.NotFound(errors.New("user not found"))
		}
		return ctx.InternalServerError()
	}

	// Map user to user response
	response := dto.UserResponseFromDomain(user)
	return ctx.JSON(response)
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

// getUsersWithStrikeDetails returns all users with strikes or bans including full details
// @Summary      Gets users with strike and ban details
// @Tags         users
// @Success      200  {array}   dto.UserWithStrikeDetailsResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /users/with-strikes [get]
func (u *users) getUsersWithStrikeDetails(ctx *handler.Context) error {
	users, err := u.strikeService.GetUsersWithStrikeDetails(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}

	response := dto.UsersWithStrikeDetailsFromDomainList(users)
	return ctx.JSON(response)
}

// getUserWithStrikeDetails returns strike details for a user
// @Summary   Get strike details for a user
// @Tags      users
// @Param     id  path      string  true  "The ID of the user to get strike details for"
// @Success   200     {object}  dto.UserWithStrikeDetailsResponse  "OK"
// @Failure   400     {string}  string  "Bad Request"
// @Failure   401     {string}  string  "Unauthorized"
// @Failure   404     {string}  string  "Not Found"
// @Failure   500     {string}  string  "Internal Server Error"
// @Security  AdminAPIKey
// @Router    /users/{id}/strikes [get]
func (u *users) getUserWithStrikeDetails(ctx *handler.Context) error {
	userID := ctx.PathValue("id")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user id"))
	}

	user, err := u.strikeService.GetUserWithStrikeDetailsByID(ctx.Context(), userID)
	if user == nil || err != nil {
		if errors.Is(err, sql.ErrNoRows) {
			return ctx.NotFound(errors.New("user not found"))
		}
		return ctx.InternalServerError()
	}

	response := dto.UserWithStrikeDetailsFromDomain(*user)
	return ctx.JSON(response)
}

// addStrike adds a strike to a user
// @Summary      Add a strike to a user
// @Tags         users
// @Param        id    path      string                 true  "User ID"
// @Param        body  body      dto.AddStrikeRequest   true  "Strike payload"
// @Success      200  {object}  dto.AddStrikeResponse  "The result of adding a strike"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /users/{id}/strikes [post]
func (u *users) addStrike(ctx *handler.Context) error {
	userID := ctx.PathValue("id")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user id"))
	}

	var req dto.AddStrikeRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	if req.StrikedBy == "" || req.Count <= 0 || req.Reason == "" {
		return ctx.BadRequest(errors.New("missing required strike fields"))
	}

	if _, err := u.strikeService.GetUserByID(ctx.Context(), userID); err != nil {
		return ctx.NotFound(errors.New("user not found"))
	}

	banInfo, err := u.strikeService.GetBanInfoByUserID(ctx.Context(), userID)
	if err != nil {
		return ctx.InternalServerError()
	}
	if banInfo != nil {
		return ctx.BadRequest(errors.New("user is banned"))
	}

	usersWithStrikeDetails, err := u.strikeService.GetUsersWithStrikeDetails(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}

	previousStrikes := 0
	for _, user := range usersWithStrikeDetails {
		if user.ID == userID {
			for _, dot := range user.Dots {
				previousStrikes += dot.Count
			}
			break
		}
	}

	shouldBeBanned := previousStrikes+req.Count >= 5
	overflowStrikes := previousStrikes + req.Count - 5

	if shouldBeBanned {
		_, err = u.strikeService.CreateBan(ctx.Context(), model.NewBanInfo{
			UserID:    userID,
			Reason:    req.Reason,
			BannedBy:  req.StrikedBy,
			ExpiresAt: time.Now().AddDate(0, req.BanExpiresMonths, 0),
		})
		if err != nil {
			return ctx.InternalServerError()
		}

		if err = u.strikeService.DeleteDotsByUserID(ctx.Context(), userID); err != nil {
			return ctx.InternalServerError()
		}

		if overflowStrikes > 0 {
			_, err = u.strikeService.CreateDot(ctx.Context(), model.NewDot{
				Count:     overflowStrikes,
				Reason:    req.Reason,
				UserID:    userID,
				StrikedBy: req.StrikedBy,
				ExpiresAt: time.Now().AddDate(0, req.StrikeExpiresMonths, 0),
			})
			if err != nil {
				return ctx.InternalServerError()
			}
		}

		return ctx.JSON(dto.AddStrikeResponse{IsBanned: true, Message: "user banned"})
	}

	_, err = u.strikeService.CreateDot(ctx.Context(), model.NewDot{
		Count:     req.Count,
		Reason:    req.Reason,
		UserID:    userID,
		StrikedBy: req.StrikedBy,
		ExpiresAt: time.Now().AddDate(0, req.StrikeExpiresMonths, 0),
	})
	if err != nil {
		return ctx.InternalServerError()
	}

	return ctx.JSON(dto.AddStrikeResponse{IsBanned: false, Message: "strike added"})
}

// removeBan removes a ban for a user
// @Summary      Remove a ban for a user
// @Tags         users
// @Param        id  path      string  true  "The ID of the user to unban"
// @Success      200     {string}  string  "OK"
// @Failure      400     {string}  string  "Bad Request"
// @Failure      401     {string}  string  "Unauthorized"
// @Failure      500     {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /users/{id}/ban [delete]
func (u *users) removeBan(ctx *handler.Context) error {
	userID := ctx.PathValue("id")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user id"))
	}

	if err := u.strikeService.DeleteBanByUserID(ctx.Context(), userID); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}

// removeStrike removes a strike by its ID
// @Summary      Remove a strike by its ID
// @Tags         users
// @Param        id        path      string  true  "The ID of the user"
// @Param        strikeId  path      int     true  "The ID of the strike to remove"
// @Success      200     {string}  string  "OK"
// @Failure      400     {string}  string  "Bad Request"
// @Failure      401     {string}  string  "Unauthorized"
// @Failure      500     {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /users/{id}/strikes/{strikeId} [delete]
func (u *users) removeStrike(ctx *handler.Context) error {
	userID := ctx.PathValue("id")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user id"))
	}

	strikeID, err := ctx.PathValueInt("strikeId")
	if err != nil {
		return err
	}

	if err = u.strikeService.DeleteDotByIDAndUserID(ctx.Context(), strikeID, userID); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}
