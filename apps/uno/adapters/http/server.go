package http

import (
	"uno/adapters/http/router"
	"uno/adapters/http/routes/api"
	"uno/config"
	"uno/domain/ports"
	"uno/domain/service"

	"github.com/jesperkha/notifier"
)

// @title           Uno API
// @version         1.0
// @description     HTTP REST API for echo Webkom Uno backend

// @contact.name   echo Webkom
// @contact.email  webkom@echo.uib.no

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
	logger ports.Logger,
	config *config.Config,
	authService *service.AuthService,
	happeningService *service.HappeningService,
	degreeService *service.DegreeService,
	siteFeedbackService *service.SiteFeedbackService,
	shoppingListService *service.ShoppingListService,
	userService *service.UserService,
	strikeSerivce *service.StrikeService,
	accessRequestService *service.AccessRequestService,
	whitelistService *service.WhitelistService,
	commentService *service.CommentService,
) {
	r := router.New(config.ServiceName, logger)
	// withAuth := router.NewWithAuthHandler(authService)
	admin := router.NewAdminMiddleware(config.AdminAPIKey)

	// Health check route
	r.Handle("GET", "/", api.HealthHandler())

	// Happening routes
	r.Handle("GET", "/happenings", api.GetHappeningsHandler(logger, happeningService))
	r.Handle("GET", "/happenings/{id}", api.GetHappeningById(logger, happeningService))
	r.Handle("GET", "/happenings/{id}/questions", api.GetHappeningQuestions(logger, happeningService))
	r.Handle("GET", "/happenings/{id}/registrations/count", api.GetHappeningRegistrationsCount(logger, happeningService))
	r.Handle("GET", "/happenings/registrations/count", api.GetHappeningRegistrationsCountMany(logger, happeningService))
	r.Handle("GET", "/happenings/{id}/registrations", api.GetHappeningRegistrations(logger, happeningService), admin)
	r.Handle("GET", "/happenings/{id}/spot-ranges", api.GetHappeningSpotRanges(logger, happeningService), admin)
	r.Handle("POST", "/happenings/{id}/register", api.RegisterForHappening(logger, happeningService), admin)

	// Degree routes
	r.Handle("GET", "/degrees", api.GetDegreesHandler(logger, degreeService))
	r.Handle("POST", "/degrees", api.CreateDegreeHandler(logger, degreeService), admin)
	r.Handle("POST", "/degrees/{id}", api.UpdateDegreeHandler(logger, degreeService), admin)
	r.Handle("DELETE", "/degrees/{id}", api.DeleteDegreeHandler(logger, degreeService), admin)

	// Site feedback routes
	r.Handle("GET", "/feedbacks", api.GetSiteFeedbacksHandler(logger, siteFeedbackService), admin)
	r.Handle("GET", "/feedbacks/{id}", api.GetSiteFeedbackByIDHandler(logger, siteFeedbackService), admin)

	// Shopping list routes
	r.Handle("GET", "/shopping", api.GetShoppingList(logger, shoppingListService), admin)

	// Birthday routes
	r.Handle("GET", "/birthdays", api.BirthdaysTodayHandler(logger, userService))

	// Strike routes
	r.Handle("POST", "/strikes/unban", api.UnbanUsersWithExpiredStrikesHandler(logger, strikeSerivce), admin)
	r.Handle("GET", "/strikes/users", api.GetUsersWithStrikesHandler(logger, strikeSerivce), admin)
	r.Handle("GET", "/strikes/banned", api.GetBannedUsers(logger, strikeSerivce), admin)

	// Access request routes
	r.Handle("GET", "/access-requests", api.GetAccessRequestsHandler(logger, accessRequestService), admin)

	// Whitelist routes
	r.Handle("GET", "/whitelist", api.GetWhitelistHandler(logger, whitelistService), admin)
	r.Handle("GET", "/whitelist/{email}", api.GetWhitelistByEmailHandler(logger, whitelistService), admin)

	// Comment routes
	r.Handle("GET", "/comments/{id}", api.GetCommentsByIDHandler(logger, commentService))
	r.Handle("POST", "/comments", api.CreateCommentHandler(logger, commentService), admin)
	r.Handle("POST", "/comments/{id}/reaction", api.ReactToCommentHandler(logger, commentService), admin)

	// Swagger UI
	r.Mount("/swagger", api.SwaggerRouter(config.ApiPort))

	r.Serve(notif, config.ApiPort)
}
