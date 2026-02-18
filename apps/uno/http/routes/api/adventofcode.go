package api

import (
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type adventOfCode struct {
	logger     port.Logger
	aocService *service.AdventOfCodeService
}

func NewAdventOfCodeMux(logger port.Logger, aocService *service.AdventOfCodeService) *router.Mux {
	aoc := adventOfCode{logger, aocService}
	mux := router.NewMux()

	// Admin
	mux.Handle("GET", "/leaderboard", aoc.GetLeaderboardHandler)

	return mux
}

// GetLeaderboardHandler returns the Advent of Code leaderboard
// @Summary	     Get Advent of Code leaderboard
// @Tags         advent_of_code
// @Produce      json
// @Success      200  {array}  dto.AdventOfCodeMemberResponse  "OK"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Router       /advent-of-code/leaderboard [get]
func (a *adventOfCode) GetLeaderboardHandler(ctx *handler.Context) error {
	leaderboard, err := a.aocService.GetAdventOfCodeLeaderboard(ctx.Context(), 2025)
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	response := dto.AdventOfCodeLeaderboardFromDomain(leaderboard)

	return ctx.JSON(response)
}
