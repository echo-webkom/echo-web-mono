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

func RunServer(
	notif *notifier.Notifier,
	config *config.Config,
	authService *services.AuthService,
	happeningService *services.HappeningService,
	degreeService *services.DegreeService,
) {
	r := router.New(config.ServiceName)
	admin := router.NewAuthMiddleware(authService)

	r.Handle("GET", "/", api.HealthHandler())

	// Happening routes
	r.Handle("GET", "/happenings", api.GetHappeningsHandler(happeningService))
	r.Handle("GET", "/happenings/{id}", api.GetHappeningById(happeningService))
	r.Handle("GET", "/happenings/{id}/questions", api.GetHappeningQuestions(happeningService))
	r.Handle("GET", "/happenings/{id}/registrations/count", api.GetHappeningRegistrationsCount(happeningService))

	// Degree routes
	r.Handle("GET", "/degrees", api.GetDegreesHandler(degreeService))
	r.Handle("POST", "/degrees", api.CreateDegreeHandler(degreeService), admin)
	r.Handle("POST", "/degrees/{id}", api.UpdateDegreeHandler(degreeService), admin)
	r.Handle("DELETE", "/degrees/{id}", api.DeleteDegreeHandler(degreeService), admin)

	// Admin
	r.Handle("GET", "/happenings/{id}/registrations", api.GetHappeningRegistrations(happeningService), admin)
	r.Handle("GET", "/happenings/{id}/spot-ranges", api.GetHappeningSpotRanges(happeningService), admin)

	// Swagger UI
	r.Mount("/swagger", api.SwaggerRouter(config.ApiPort))

	r.Serve(notif, config.ApiPort)
}
