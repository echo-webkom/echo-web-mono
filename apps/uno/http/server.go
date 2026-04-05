package http

import (
	"uno/config"
	"uno/domain/port"
	"uno/domain/service"
	"uno/domain/service/providers"
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

type ServerDeps struct {
	Notifier *notifier.Notifier

	Logger port.Logger
	Config *config.Config

	FeideProvider *providers.FeideProvider

	AuthService          *service.AuthService
	HappeningService     *service.HappeningService
	DegreeService        *service.DegreeService
	SiteFeedbackService  *service.SiteFeedbackService
	ShoppingListService  *service.ShoppingListService
	UserService          *service.UserService
	StrikeSerivce        *service.StrikeService
	AccessRequestService *service.AccessRequestService
	WhitelistService     *service.WhitelistService
	CommentService       *service.CommentService
	WeatherService       *service.WeatherService
	DatabrusService      *service.DatabrusService
	AdventOfCodeService  *service.AdventOfCodeService
	GroupService         *service.GroupService
	ReactionService      *service.ReactionService
	QuoteService         *service.QuoteService
	CMSService           *service.CMSService
}

func RunServer(deps ServerDeps) {
	r := router.New(deps.Logger, middleware.Logger(deps.Logger))

	admin := middleware.NewAdminMiddleware(deps.AuthService, deps.Config.AdminAPIKey)
	session := middleware.NewSessionMiddleware(deps.AuthService)
	sessionOrAdmin := middleware.NewAdminOrSessionMiddleware(deps.AuthService, deps.Config.AdminAPIKey)

	// Health check route
	r.Handle("GET", "/", api.HealthHandler)

	// Auth routes
	r.Mount("/auth", api.NewAuthMux(
		deps.Logger,
		deps.Config,
		deps.AuthService,
		deps.UserService,
		session,
	))

	// Happening routes
	r.Mount("/happenings", api.NewHappeningMux(deps.Logger, deps.HappeningService, admin))

	// Degree routes
	r.Mount("/degrees", api.NewDegreeMux(deps.Logger, deps.DegreeService, admin))

	// Site feedback routes
	r.Mount("/feedbacks", api.NewSiteFeedbackMux(deps.Logger, deps.SiteFeedbackService, admin))

	// Shopping list routes
	r.Mount("/shopping", api.NewShoppingListMux(deps.Logger, deps.ShoppingListService, admin))

	// Birthday routes
	r.Mount("/birthdays", api.NewBirthdayMux(deps.Logger, deps.UserService))

	// Strike routes
	r.Mount("/strikes", api.NewStrikesMux(deps.Logger, deps.StrikeSerivce, admin))

	// Access request routes
	r.Mount("/access-requests", api.NewAccessRequestMux(deps.Logger, deps.AccessRequestService, admin))

	// Whitelist routes
	r.Mount("/whitelist", api.NewWhitelistMux(deps.Logger, deps.WhitelistService, admin))

	// Comment routes
	r.Mount("/comments", api.NewCommentMux(deps.Logger, deps.CommentService, admin))

	// Weather routes
	r.Mount("/weather", api.NewWeatherMux(deps.Logger, deps.WeatherService))

	// Databrus routes
	r.Mount("/databrus", api.NewDatabrusMux(deps.Logger, deps.DatabrusService))

	// Advent of Code routes
	r.Mount("/advent-of-code", api.NewAdventOfCodeMux(deps.Logger, deps.AdventOfCodeService), admin)

	// Group routes
	r.Mount("/groups", api.NewGroupMux(deps.Logger, deps.GroupService, admin))

	// Reaction routes
	r.Mount("/reactions", api.NewReactionMux(deps.Logger, deps.ReactionService, admin))

	// User routes
	r.Mount("/users", api.NewUsersMux(deps.Logger, deps.UserService, deps.HappeningService, admin, session))

	// Quote routes
	r.Mount("/quotes", api.NewQuoteMux(deps.Logger, deps.QuoteService, sessionOrAdmin, session, admin))

	// Sanity routes
	r.Mount("/sanity", api.NewSanityMux(deps.Logger, deps.HappeningService, admin, deps.CMSService))

	// Swagger UI
	r.Mount("/swagger", api.SwaggerRouter(deps.Config.ApiPort))

	r.Serve(deps.Notifier, deps.Config.ApiPort)
}
