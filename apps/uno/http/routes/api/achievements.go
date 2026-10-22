package api

import (
	"errors"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type achievements struct {
	logger port.Logger
	achievementService *service.AchievementService
}

func NewAchievementMux(logger port.Logger, achievementService *service.AchievementService) *router.Mux {
	mux := router.NewMux()
	a := achievements{logger, achievementService}

	mux.GET("/{userID}", a.getAchievements)

	return mux
}


// getAchievements return the users achievements 
// @Summary	     Get users achievements 
// @Tags         achievements
// @Produce      json
// @Param 		 userID path string true "User ID"
// @Success      200  {object}  dto.AchievementResponse "OK"
// @Failure      500  {string}  string  "Internal Server Error"
// @Router       /achievements/{userID} [get]
func (a *achievements) getAchievements(ctx *handler.Context) error {

	
	userID := ctx.PathValue("userID"); 
	
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user ID"))
	}

	achievements, err := a.achievementService.GetAchievements(ctx.Context(), userID)

	if err != nil {
		return ctx.InternalServerError()
	}

	response := dto.FromDomain(achievements)

	return ctx.JSON(response)
}