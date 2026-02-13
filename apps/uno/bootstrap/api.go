package bootstrap

import (
	"context"
	"log"
	"os"
	"syscall"
	"uno/config"
	"uno/domain/service"
	"uno/http"
	"uno/infrastructure/external"
	"uno/infrastructure/decorator"
	"uno/infrastructure/logging"
	"uno/infrastructure/postgres"
	"uno/infrastructure/telemetry"

	"github.com/jesperkha/notifier"
)

func RunApi() {
	config := config.Load()
	notif := notifier.New()

	// Initialize structured logging
	logger := logging.NewWithConfig(config.Environment)
	logger.Info(context.Background(), "starting uno-api")

	// Initialize OpenTelemetry
	shutdown, err := telemetry.New(telemetry.TelemetryConfig{
		ServiceName: config.ServiceName,
		Environment: config.Environment,
		Enabled:     config.TelemetryEnabled,
	})
	if err != nil {
		logger.Error(context.Background(), "failed to initialize telemetry", "error", err)
	}
	defer func() {
		if err := shutdown(context.Background()); err != nil {
			logger.Error(context.Background(), "failed to shutdown telemetry", "error", err)
		}
	}()

	if config.TelemetryEnabled {
		logger.Info(context.Background(), "telemetry enabled", "endpoint", config.OTLPEndpoint)
	} else {
		logger.Info(context.Background(), "telemetry disabled")
	}

	// Initialize database connection
	db, err := postgres.New(config.DatabaseURL)
	if err != nil {
		logger.Error(context.Background(), "failed to connect to database", "error", err)
		log.Fatal(err)
	}
	logger.Info(context.Background(), "database connected")

	// Initialize repositories
	happeningRepo := postgres.NewHappeningRepo(db, logger)
	userRepo := postgres.NewUserRepo(db, logger)
	sessionRepo := postgres.NewSessionRepo(db, logger)
	degreeRepo := postgres.NewDegreeRepo(db, logger)
	siteFeedbackRepo := postgres.NewSiteFeedbackRepo(db, logger)
	shoppingListItemRepo := postgres.NewShoppingListRepo(db, logger)
	usersToShoppingListItemRepo := postgres.NewUsersToShoppingListItemRepo(db, logger)
	dotRepo := postgres.NewDotRepo(db, logger)
	banInfoRepo := postgres.NewBanInfoRepo(db, logger)
	accessRequestRepo := postgres.NewAccessRequestRepo(db, logger)
	whitelistRepo := postgres.NewWhitelistRepo(db, logger)
	commentRepo := postgres.NewCommentRepo(db, logger)
	registrationRepo := postgres.NewRegistrationRepo(db, logger)
	weatherRepo := external.NewYrRepo(logger)
	databrusRepo := external.NewDatabrusRepo(logger)

	// Initialize decorators
	registrationRepo = decorator.NewRaffleDecorator(registrationRepo, notif)

	// Initialize services
	authService := service.NewAuthService(sessionRepo, userRepo)
	happeningService := service.NewHappeningService(happeningRepo, userRepo, registrationRepo, banInfoRepo)
	degreeService := service.NewDegreeService(degreeRepo)
	siteFeedbackService := service.NewSiteFeedbackService(siteFeedbackRepo)
	shoppingListService := service.NewShoppingListService(shoppingListItemRepo, usersToShoppingListItemRepo)
	userService := service.NewUserService(userRepo)
	strikeService := service.NewStrikeService(dotRepo, banInfoRepo, userRepo)
	accessRequestService := service.NewAccessRequestService(accessRequestRepo)
	whitelistService := service.NewWhitelistService(whitelistRepo)
	commentService := service.NewCommentService(commentRepo)
	weatherService := service.NewWeatherService(weatherRepo)
	databrusService := service.NewDatabrusService(logger, databrusRepo)

	go http.RunServer(
		notif,
		logger,
		config,
		authService,
		happeningService,
		degreeService,
		siteFeedbackService,
		shoppingListService,
		userService,
		strikeService,
		accessRequestService,
		whitelistService,
		commentService,
		weatherService,
		databrusService,
	)

	notif.NotifyOnSignal(syscall.SIGINT, os.Interrupt)
	logger.Info(context.Background(), "received shutdown signal, gracefully shutting down")
}
