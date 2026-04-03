package api

import (
	"errors"
	"time"
	"uno/domain/model"
	_ "uno/domain/model" // swagger
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
	mux.Handle("GET", "/banned", s.getBannedUsers, admin)
	mux.Handle("GET", "/users", s.getUsersWithStrikes, admin)
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

// getUsersWithStrikes returns all users with strikes and bans
// @Summary	     Gets users with strikes and bans
// @Tags         strikes
// @Success      200  {array}  model.UserWithStrikes  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/users [get]
func (s *strikes) getUsersWithStrikes(ctx *handler.Context) error {
	users, err := s.strikeService.GetUsersWithStrikes(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}

	// Convert to DTO
	response := dto.UsersWithStrikesFromDomainList(users)
	return ctx.JSON(response)
}

// getBannedUsers returns all banned users
// @Summary	     Gets all users that are banned
// @Tags         strikes
// @Success      200  {array}  model.UserWithBanInfo  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/banned [get]
func (s *strikes) getBannedUsers(ctx *handler.Context) error {
	users, err := s.strikeService.GetBannedUsers(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}

	// Convert to DTO
	response := dto.BannedUsersFromDomainList(users)
	return ctx.JSON(response)
}

type addStrikeRequest struct {
	UserID              string `json:"userId"`
	Count               int    `json:"count"`
	Reason              string `json:"reason"`
	StrikeExpiresMonths int    `json:"strikeExpiresInMonths"`
	BanExpiresMonths    int    `json:"banExpiresInMonths"`
	StrikedBy           string `json:"strikedBy"`
}

func (s *strikes) addStrike(ctx *handler.Context) error {
	var req addStrikeRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	if req.UserID == "" || req.StrikedBy == "" || req.Count <= 0 || req.Reason == "" {
		return ctx.BadRequest(errors.New("missing required strike fields"))
	}

	if _, err := s.strikeService.UserRepo().GetUserByID(ctx.Context(), req.UserID); err != nil {
		return ctx.NotFound(errors.New("user not found"))
	}

	banInfo, err := s.strikeService.BanInfoRepo().GetBanInfoByUserID(ctx.Context(), req.UserID)
	if err != nil {
		return ctx.InternalServerError()
	}
	if banInfo != nil {
		return ctx.BadRequest(errors.New("user is banned"))
	}

	usersWithStrikes, err := s.strikeService.GetUsersWithStrikes(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}

	previousStrikes := 0
	for _, user := range usersWithStrikes {
		if user.ID == req.UserID {
			previousStrikes = user.Strikes
			break
		}
	}

	shouldBeBanned := previousStrikes+req.Count >= 5
	overflowStrikes := previousStrikes + req.Count - 5

	if shouldBeBanned {
		_, err = s.strikeService.BanInfoRepo().CreateBan(ctx.Context(), model.NewBanInfo{
			UserID:    req.UserID,
			Reason:    req.Reason,
			BannedBy:  req.StrikedBy,
			ExpiresAt: time.Now().AddDate(0, req.BanExpiresMonths, 0),
		})
		if err != nil {
			return ctx.InternalServerError()
		}

		if err = s.strikeService.DotRepo().DeleteDotsByUserID(ctx.Context(), req.UserID); err != nil {
			return ctx.InternalServerError()
		}

		if overflowStrikes > 0 {
			_, err = s.strikeService.DotRepo().CreateDot(ctx.Context(), model.NewDot{
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

		return ctx.JSON(map[string]string{"message": "user banned"})
	}

	_, err = s.strikeService.DotRepo().CreateDot(ctx.Context(), model.NewDot{
		Count:     req.Count,
		Reason:    req.Reason,
		UserID:    req.UserID,
		StrikedBy: req.StrikedBy,
		ExpiresAt: time.Now().AddDate(0, req.StrikeExpiresMonths, 0),
	})
	if err != nil {
		return ctx.InternalServerError()
	}

	return ctx.JSON(map[string]string{"message": "strike added"})
}

func (s *strikes) removeBan(ctx *handler.Context) error {
	userID := ctx.PathValue("userId")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user id"))
	}

	if err := s.strikeService.BanInfoRepo().DeleteBanByUserID(ctx.Context(), userID); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}

func (s *strikes) removeStrike(ctx *handler.Context) error {
	id, err := ctx.PathValueInt("id")
	if err != nil {
		return err
	}

	userID, ok := ctx.QueryParam("userId")
	if !ok || userID == "" {
		return ctx.BadRequest(errors.New("missing user id"))
	}

	if err = s.strikeService.DotRepo().DeleteDotByIDAndUserID(ctx.Context(), id, userID); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}
