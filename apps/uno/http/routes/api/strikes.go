package api

import (
	"errors"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type strikes struct {
	logger        port.Logger
	strikeService *service.StrikeService
}

func NewStrikesMux(logger port.Logger, strikesService *service.StrikeService, admin handler.Middleware) *router.Mux {
	mux := router.NewMux()
	s := strikes{logger, strikesService}

	// Admin
	mux.Handle("POST", "/unban", s.unbanUsersWithExpiredStrikes, admin)
	mux.Handle("GET", "/details", s.getUsersWithStrikeDetails, admin)
	mux.Handle("POST", "/", s.addStrike, admin)
	mux.Handle("DELETE", "/ban/{userId}", s.removeBan, admin)
	mux.Handle("DELETE", "/{id}", s.removeStrike, admin)

	return mux
}

// unbanUsersWithExpiredStrikes bans users with expired strikes and bans
// @Summary	     Unban users with expired strikes and bans
// @Tags         strikes
// @Success      200  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/unban [post]
func (s *strikes) unbanUsersWithExpiredStrikes(ctx *handler.Context) error {
	if err := s.strikeService.UnbanUsersWithExpiredStrikes(ctx.Context()); err != nil {
		return ctx.InternalServerError()
	}
	return ctx.Ok()
}

// getUsersWithStrikeDetails returns all users with strikes or bans including full details
// @Summary      Gets users with strike and ban details
// @Tags         strikes
// @Success      200  {array}   dto.UserWithStrikeDetailsResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/details [get]
func (s *strikes) getUsersWithStrikeDetails(ctx *handler.Context) error {
	users, err := s.strikeService.GetUsersWithStrikeDetails(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}

	response := dto.UsersWithStrikeDetailsFromDomainList(users)
	return ctx.JSON(response)
}

// @Summary      Add a strike
// @Tags         strikes
// @Param        body  body      dto.AddStrikeRequest   true  "Strike payload"
// @Success      200  {object}  dto.AddStrikeResponse  "The result of adding a strike"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes [post]
func (s *strikes) addStrike(ctx *handler.Context) error {
	var req dto.AddStrikeRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	if req.UserID == "" || req.StrikedBy == "" || req.Count <= 0 || req.Reason == "" {
		return ctx.BadRequest(errors.New("missing required strike fields"))
	}

	if _, err := s.strikeService.GetUserByID(ctx.Context(), req.UserID); err != nil {
		return ctx.NotFound(errors.New("user not found"))
	}

	banInfo, err := s.strikeService.GetBanInfoByUserID(ctx.Context(), req.UserID)
	if err != nil {
		return ctx.InternalServerError()
	}
	if banInfo != nil {
		return ctx.BadRequest(errors.New("user is banned"))
	}

	usersWithStrikeDetails, err := s.strikeService.GetUsersWithStrikeDetails(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}

	previousStrikes := 0
	for _, user := range usersWithStrikeDetails {
		if user.ID == req.UserID {
			for _, dot := range user.Dots {
				previousStrikes += dot.Count
			}
			break
		}
	}

	shouldBeBanned := previousStrikes+req.Count >= 5
	overflowStrikes := previousStrikes + req.Count - 5

	if shouldBeBanned {
		_, err = s.strikeService.CreateBan(ctx.Context(), model.NewBanInfo{
			UserID:    req.UserID,
			Reason:    req.Reason,
			BannedBy:  req.StrikedBy,
			ExpiresAt: time.Now().AddDate(0, req.BanExpiresMonths, 0),
		})
		if err != nil {
			return ctx.InternalServerError()
		}

		if err = s.strikeService.DeleteDotsByUserID(ctx.Context(), req.UserID); err != nil {
			return ctx.InternalServerError()
		}

		if overflowStrikes > 0 {
			_, err = s.strikeService.CreateDot(ctx.Context(), model.NewDot{
				Count:     overflowStrikes,
				Reason:    req.Reason,
				UserID:    req.UserID,
				StrikedBy: req.StrikedBy,
				ExpiresAt: time.Now().AddDate(0, req.StrikeExpiresMonths, 0),
			})
			if err != nil {
				return ctx.InternalServerError()
			}
		}

		return ctx.JSON(dto.AddStrikeResponse{IsBanned: true, Message: "user banned"})
	}

	_, err = s.strikeService.CreateDot(ctx.Context(), model.NewDot{
		Count:     req.Count,
		Reason:    req.Reason,
		UserID:    req.UserID,
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
// @Tags         strikes
// @Param        userId  path      string  true  "The ID of the user to unban"
// @Success      200     {string}  string  "OK"
// @Failure      400     {string}  string  "Bad Request"
// @Failure      401     {string}  string  "Unauthorized"
// @Failure      500     {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/ban/{userId} [delete]
func (s *strikes) removeBan(ctx *handler.Context) error {
	userID := ctx.PathValue("userId")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user id"))
	}

	if err := s.strikeService.DeleteBanByUserID(ctx.Context(), userID); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}

// removeStrike removes a strike by its ID and user ID
// @Summary      Remove a strike by its ID and user ID
// @Tags         strikes
// @Param        id      path      int     true  "The ID of the strike to remove"
// @Param        userId  query     string  true  "The ID of the user whose strike to remove"
// @Success      200     {string}  string  "OK"
// @Failure      400     {string}  string  "Bad Request"
// @Failure      401     {string}  string  "Unauthorized"
// @Failure      500     {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/{id} [delete]
func (s *strikes) removeStrike(ctx *handler.Context) error {
	id, err := ctx.PathValueInt("id")
	if err != nil {
		return err
	}

	userID, ok := ctx.QueryParam("userId")
	if !ok || userID == "" {
		return ctx.BadRequest(errors.New("missing user id"))
	}

	if err = s.strikeService.DeleteDotByIDAndUserID(ctx.Context(), id, userID); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}
