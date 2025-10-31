package http

import (
	"uno/adapters/http/router"
	"uno/adapters/http/routes/api"
	"uno/config"
	"uno/services"

	"github.com/jesperkha/notifier"
)

// @title           Uno API
// @version         1.0
// @description     HTTP REST API for echo Webkom Uno backend

// @contact.name   echo Webkom
// @contact.email  webkom@echo.uib.no

// @host      localhost:8080
// @BasePath  /

// @securityDefinitions.apikey  BearerAuth
// @in                          header
// @name                        Authorization
// @description                 Enter your bearer token in the format: Bearer {token}

func RunServer(notif *notifier.Notifier, config *config.Config, as *services.AuthService, hs *services.HappeningService) {
	r := router.New(config.ServiceName)
	admin := router.NewAuthMiddleware(as)

	r.Handle("GET", "/", api.HealthHandler())

	r.Handle("GET", "/happenings", api.GetHappeningsHandler(hs))
	r.Handle("GET", "/happenings/{id}", api.GetHappeningById(hs))
	r.Handle("GET", "/happenings/{id}/questions", api.GetHappeningQuestions(hs))
	r.Handle("GET", "/happenings/{id}/registrations/count", api.GetHappeningRegistrationsCount(hs))

	// Admin
	r.Handle("GET", "/happenings/{id}/registrations", api.GetHappeningRegistrations(hs), admin)
	r.Handle("GET", "/happenings/{id}/spot-ranges", api.GetHappeningSpotRanges(hs), admin)

	// Swagger UI
	r.Mount("/swagger", api.SwaggerRouter(config.ApiPort))

	r.Serve(notif, config.ApiPort)
}
