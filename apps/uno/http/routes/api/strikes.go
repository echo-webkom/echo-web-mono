package api

import (
	"net/http"
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
	mux.Handle("POST", "/unban", s.UnbanUsersWithExpiredStrikesHandler, admin)
	mux.Handle("GET", "/banned", s.GetBannedUsers, admin)
	mux.Handle("GET", "/users", s.GetUsersWithStrikesHandler, admin)

	return mux
}

// UnbanUsersWithExpiredStrikesHandler bans users with expired strikes and bans
// @Summary	     Unban users with expired strikes and bans
// @Tags         strikes
// @Success      200  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/unban [post]
func (s *strikes) UnbanUsersWithExpiredStrikesHandler(ctx *handler.Context) error {
	if err := s.strikeService.UnbanUsersWithExpiredStrikes(ctx.Context()); err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}
	return ctx.Ok()
}

// GetUsersWithStrikesHandler returns all users with strikes and bans
// @Summary	     Gets users with strikes and bans
// @Tags         strikes
// @Success      200  {array}  model.UserWithStrikes  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/users [get]
func (s *strikes) GetUsersWithStrikesHandler(ctx *handler.Context) error {
	users, err := s.strikeService.GetUsersWithStrikes(ctx.Context())
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert to DTO
	response := dto.UsersWithStrikesFromDomainList(users)

	return ctx.JSON(response)
}

// GetBannedUsers returns all banned users
// @Summary	     Gets all users that are banned
// @Tags         strikes
// @Success      200  {array}  model.UserWithBanInfo  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /strikes/banned [get]
func (s *strikes) GetBannedUsers(ctx *handler.Context) error {
	users, err := s.strikeService.GetBannedUsers(ctx.Context())
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert to DTO
	response := dto.BannedUsersFromDomainList(users)

	return ctx.JSON(response)
}
