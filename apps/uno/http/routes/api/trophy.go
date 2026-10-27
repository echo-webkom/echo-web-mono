package api

import (
	"errors"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type trophy struct {
	logger        port.Logger
	trophyService *service.TrophyService
}

func NewTrophyMux(
	logger port.Logger,
	trophyService *service.TrophyService,
) *router.Mux {
	mux := router.NewMux()
	t := trophy{logger: logger, trophyService: trophyService}
	mux.GET("/{userID}", t.getUserTrophies)
	return mux
}

// getUserTrophies returns a list of the users trophies
// @Summary	     Gets a list of all trophies the user has unlocked
// @Tags         Trophy
// @Param        userID path      string               true  "User ID"
// @Success      200  {array}   dto.UserTrophyResponse "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      404  {string}  string  "User Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Produce	     json
// @Router       /trophy/{userID} [get]
func (t *trophy) getUserTrophies(ctx *handler.Context) error {
	userID := ctx.PathValue("userID")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user ID"))
	}

	trophies, err := t.trophyService.GetUserTrophies(ctx.Context(), userID)
	if err != nil {
		return ctx.InternalServerError()
	}

	return ctx.JSON(dto.UserTrophiesFromDomain(trophies))
}
