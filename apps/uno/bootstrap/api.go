package bootstrap

import (
	"context"
	"log"
	"os"
	"syscall"
	"uno/adapters/http"
	"uno/config"
	"uno/domain/services"
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

	// Initialize services
	authService := services.NewAuthService(sessionRepo, userRepo)
	happeningService := services.NewHappeningService(happeningRepo, userRepo, registrationRepo, banInfoRepo)
	degreeService := services.NewDegreeService(degreeRepo)
	siteFeedbackService := services.NewSiteFeedbackService(siteFeedbackRepo)
	shoppingListService := services.NewShoppingListService(shoppingListItemRepo, usersToShoppingListItemRepo, userRepo)
	userService := services.NewUserService(userRepo)
	strikeService := services.NewStrikeService(dotRepo, banInfoRepo, userRepo)
	accessRequestService := services.NewAccessRequestService(accessRequestRepo)
	whitelistService := services.NewWhitelistService(whitelistRepo)
	commentService := services.NewCommentService(commentRepo)

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
	)

	notif.NotifyOnSignal(syscall.SIGINT, os.Interrupt)
	logger.Info(context.Background(), "received shutdown signal, gracefully shutting down")
}
