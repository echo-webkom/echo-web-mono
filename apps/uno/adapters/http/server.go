package http

import (
	"uno/adapters/http/router"
	"uno/adapters/http/routes/api"
	"uno/config"
	"uno/domain/services"

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

// @securityDefinitions.apikey  AdminAPIKey
// @in                          header
// @name                        X-Admin-Key
// @description                 Admin API Key for protected endpoints

func RunServer(
	notif *notifier.Notifier,
	config *config.Config,
	authService *services.AuthService,
	happeningService *services.HappeningService,
	degreeService *services.DegreeService,
	siteFeedbackService *services.SiteFeedbackService,
	shoppingListService *services.ShoppingListService,
	userService *services.UserService,
) {
	r := router.New(config.ServiceName)
	// auth := router.NewAuthMiddleware(authService)
	admin := router.NewAdminMiddleware(config.AdminAPIKey)

	// Health check route
	r.Handle("GET", "/", api.HealthHandler())

	// Happening routes
	r.Handle("GET", "/happenings", api.GetHappeningsHandler(happeningService))
	r.Handle("GET", "/happenings/{id}", api.GetHappeningById(happeningService))
	r.Handle("GET", "/happenings/{id}/questions", api.GetHappeningQuestions(happeningService))
	r.Handle("GET", "/happenings/{id}/registrations/count", api.GetHappeningRegistrationsCount(happeningService))
	r.Handle("GET", "/happenings/{id}/registrations", api.GetHappeningRegistrations(happeningService), admin)
	r.Handle("GET", "/happenings/{id}/spot-ranges", api.GetHappeningSpotRanges(happeningService), admin)

	// Degree routes
	r.Handle("GET", "/degrees", api.GetDegreesHandler(degreeService))
	r.Handle("POST", "/degrees", api.CreateDegreeHandler(degreeService), admin)
	r.Handle("POST", "/degrees/{id}", api.UpdateDegreeHandler(degreeService), admin)
	r.Handle("DELETE", "/degrees/{id}", api.DeleteDegreeHandler(degreeService), admin)

	// Site feedback routes
	r.Handle("GET", "/feedbacks", api.GetSiteFeedbacksHandler(siteFeedbackService), admin)
	r.Handle("GET", "/feedbacks/{id}", api.GetSiteFeedbackByIDHandler(siteFeedbackService), admin)

	// Shopping list routes
	r.Handle("GET", "/shopping", api.GetShoppingList(shoppingListService))

	// Birthday routes
	r.Handle("GET", "/birthdays", api.BirthdaysTodayHandler(userService))

	// Swagger UI
	r.Mount("/swagger", api.SwaggerRouter(config.ApiPort))

	r.Serve(notif, config.ApiPort)
}
