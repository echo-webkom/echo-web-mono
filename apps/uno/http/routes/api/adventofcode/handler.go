package adventofcode

import (
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/handler"
	"uno/http/router"
	"uno/http/routes/api"
)

type adventOfCode struct {
	logger     port.Logger
	aocService *service.AdventOfCodeService
}

func NewMux(logger port.Logger, aocService *service.AdventOfCodeService) *router.Mux {
	aoc := adventOfCode{logger, aocService}
	mux := router.NewMux()

	// Admin
	mux.Handle("GET", "/leaderboard", aoc.getLeaderboard)

	return mux
}

// getLeaderboard returns the Advent of Code leaderboard
// @Summary	     Get Advent of Code leaderboard
// @Tags         advent_of_code
// @Produce      json
// @Success      200  {array}  AdventOfCodeMemberResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Router       /advent-of-code/leaderboard [get]
func (a *adventOfCode) getLeaderboard(ctx *handler.Context) error {
	leaderboard, err := a.aocService.GetAdventOfCodeLeaderboard(ctx.Context(), 2025)
	if err != nil {
		return ctx.Error(api.ErrInternalServer, http.StatusInternalServerError)
	}

	response := AdventOfCodeLeaderboardFromDomain(leaderboard)
	return ctx.JSON(response)
}
