package http

import (
	"uno/config"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/middleware"
	"uno/http/router"
	"uno/http/routes/api"

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
	logger port.Logger,
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
	weatherService *service.WeatherService,
	databrusService *service.DatabrusService,
	adventOfCodeService *service.AdventOfCodeService,
	groupService *service.GroupService,
) {
	r := router.New(logger, middleware.Logger(logger), middleware.Telemetry(config.ServiceName))

	// withAuth := router.NewWithAuthHandler(authService)
	admin := middleware.NewAdminMiddleware(authService, config.AdminAPIKey)

	// Health check route
	r.Handle("GET", "/", api.HealthHandler)

	// Happening routes
	r.Mount("/happenings", api.NewHappeningMux(logger, happeningService, admin))

	// Degree routes
	r.Mount("/degrees", api.NewDegreeMux(logger, degreeService, admin))

	// Site feedback routes
	r.Mount("/feedbacks", api.NewSiteFeedbackMux(logger, siteFeedbackService, admin))

	// Shopping list routes
	r.Mount("/shopping", api.NewShoppingListMux(logger, shoppingListService, admin))

	// Birthday routes
	r.Mount("/birthdays", api.NewBirthdayMux(logger, userService))

	// Strike routes
	r.Mount("/strikes", api.NewStrikesMux(logger, strikeSerivce, admin))

	// Access request routes
	r.Mount("/access-requests", api.NewAccessRequestMux(logger, accessRequestService, admin))

	// Whitelist routes
	r.Mount("/whitelist", api.NewWhitelistMux(logger, whitelistService, admin))

	// Comment routes
	r.Mount("/comments", api.NewCommentMux(logger, commentService, admin))

	// Weather routes
	r.Mount("/weather", api.NewWeatherMux(logger, weatherService))

	// Databrus routes
	r.Mount("/databrus", api.NewDatabrusMux(logger, databrusService))

	// Advent of Code routes
	r.Mount("/advent-of-code", api.NewAdventOfCodeMux(logger, adventOfCodeService), admin)

	// Group routes
	r.Mount("/groups", api.NewGroupMux(logger, groupService, admin))

	// Swagger UI
	r.Mount("/swagger", api.SwaggerRouter(config.ApiPort))

	r.Serve(notif, config.ApiPort)
}
