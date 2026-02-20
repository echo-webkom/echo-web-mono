package weather

import (
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/handler"
	"uno/http/router"
	"uno/http/routes/api"
)

type weather struct {
	logger         port.Logger
	weatherService *service.WeatherService
}

func NewMux(logger port.Logger, weatherService *service.WeatherService) *router.Mux {
	mux := router.NewMux()
	s := weather{logger, weatherService}

	mux.Handle("GET", "/yr", s.getCurrentWeather)

	return mux
}

// getCurrentWeather returns the current weather from yr.no
// @Summary	     Gets the current weather from yr.no
// @Tags         weather
// @Success      200  {object}  WeatherResponse  "OK"
// @Failure      500  {string}  string  "Internal Server Error"
// @Produce	     json
// @Router       /weather/yr [get]
func (s *weather) getCurrentWeather(ctx *handler.Context) error {
	weather, err := s.weatherService.GetCurrentWeather(ctx.Context())
	if err != nil {
		return ctx.Error(api.ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert to DTO
	response := WeatherResponseFromDomain(&weather)
	return ctx.JSON(response)
}
