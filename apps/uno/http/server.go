package http

import (
	"uno/config"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/middleware"
	"uno/http/router"
	"uno/http/routes/api"
	accessrequest "uno/http/routes/api/access_request"
	"uno/http/routes/api/adventofcode"
	"uno/http/routes/api/birthday"
	"uno/http/routes/api/comment"
	"uno/http/routes/api/databrus"
	"uno/http/routes/api/degree"
	"uno/http/routes/api/group"
	"uno/http/routes/api/happening"
	"uno/http/routes/api/health"
	"uno/http/routes/api/reactions"
	shoppinglist "uno/http/routes/api/shopping_list"
	sitefeedback "uno/http/routes/api/site_feedback"
	"uno/http/routes/api/strikes"
	"uno/http/routes/api/users"
	"uno/http/routes/api/weather"
	"uno/http/routes/api/whitelist"

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
	reactionService *service.ReactionService,
) {
	r := router.New(logger, middleware.Logger(logger), middleware.Telemetry(config.ServiceName))

	// withAuth := router.NewWithAuthHandler(authService)
	admin := middleware.NewAdminMiddleware(authService, config.AdminAPIKey)

	// Health check route
	r.Handle("GET", "/", health.HealthHandler)

	// Happening routes
	r.Mount("/happenings", happening.NewMux(logger, happeningService, admin))

	// Degree routes
	r.Mount("/degrees", degree.NewMux(logger, degreeService, admin))

	// Site feedback routes
	r.Mount("/feedbacks", sitefeedback.NewMux(logger, siteFeedbackService, admin))

	// Shopping list routes
	r.Mount("/shopping", shoppinglist.NewMux(logger, shoppingListService, admin))

	// Birthday routes
	r.Mount("/birthdays", birthday.NewMux(logger, userService))

	// Strike routes
	r.Mount("/strikes", strikes.NewMux(logger, strikeSerivce, admin))

	// Access request routes
	r.Mount("/access-requests", accessrequest.NewMux(logger, accessRequestService, admin))

	// Whitelist routes
	r.Mount("/whitelist", whitelist.NewMux(logger, whitelistService, admin))

	// Comment routes
	r.Mount("/comments", comment.NewMux(logger, commentService, admin))

	// Weather routes
	r.Mount("/weather", weather.NewMux(logger, weatherService))

	// Databrus routes
	r.Mount("/databrus", databrus.NewMux(logger, databrusService))

	// Advent of Code routes
	r.Mount("/advent-of-code", adventofcode.NewMux(logger, adventOfCodeService), admin)

	// Group routes
	r.Mount("/groups", group.NewMux(logger, groupService, admin))

	// Reaction routes
	r.Mount("/reactions", reactions.NewMux(logger, reactionService, admin))

	// User routes
	r.Mount("/users", users.NewMux(logger, userService, admin))

	// Swagger UI
	r.Mount("/swagger", api.SwaggerRouter(config.ApiPort))

	r.Serve(notif, config.ApiPort)
}
