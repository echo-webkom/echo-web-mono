package bootstrap

import (
	"context"
	"log"
	"log/slog"
	"os"
	"syscall"
	"uno/adapters/http"
	"uno/adapters/logging"
	"uno/adapters/persistance/postgres"
	"uno/adapters/telemetry"
	"uno/config"
	"uno/domain/services"

	"github.com/jesperkha/notifier"
)

func RunApi() {
	config := config.Load()
	notif := notifier.New()

	// Initialize structured logging
	logger := logging.InitLogger(config.Environment)
	logger.Info("starting uno-api",
		"environment", config.Environment,
		"service", config.ServiceName,
		"version", config.ServiceVersion,
	)

	// Initialize OpenTelemetry
	shutdown, err := telemetry.InitTracer(telemetry.TelemetryConfig{
		ServiceName:    config.ServiceName,
		ServiceVersion: config.ServiceVersion,
		Environment:    config.Environment,
		OTLPEndpoint:   config.OTLPEndpoint,
		Enabled:        config.TelemetryEnabled,
	})
	if err != nil {
		logger.Error("failed to initialize telemetry", "error", err)
		log.Fatalf("failed to initialize telemetry: %v", err)
	}
	defer func() {
		if err := shutdown(context.Background()); err != nil {
			logger.Error("failed to shutdown telemetry", "error", err)
		}
	}()

	if config.TelemetryEnabled {
		slog.Info("telemetry enabled", "endpoint", config.OTLPEndpoint)
	} else {
		slog.Info("telemetry disabled")
	}

	// Initialize database connection
	db, err := postgres.New(config.DatabaseURL)
	if err != nil {
		logger.Error("failed to connect to database", "error", err)
		log.Fatal(err)
	}
	logger.Info("database connected")

	// Initialize repositories
	happeningRepo := postgres.NewHappeningRepo(db)
	userRepo := postgres.NewUserRepo(db)
	sessionRepo := postgres.NewSessionRepo(db)
	degreeRepo := postgres.NewDegreeRepo(db)
	siteFeedbackRepo := postgres.NewSiteFeedbackRepo(db)
	shoppingListItemRepo := postgres.NewShoppingListRepo(db)
	usersToShoppingListItemRepo := postgres.NewUsersToShoppingListItemRepo(db)
	dotRepo := postgres.NewDotRepo(db)
	banInfoRepo := postgres.NewBanInfoRepo(db)
	accessRequestRepo := postgres.NewAccessRequestRepo(db)
	whitelistRepo := postgres.NewWhitelistRepo(db)

	// Initialize services
	authService := services.NewAuthService(sessionRepo, userRepo)
	happeningService := services.NewHappeningService(happeningRepo)
	degreeService := services.NewDegreeService(degreeRepo)
	siteFeedbackService := services.NewSiteFeedbackService(siteFeedbackRepo)
	shoppingListService := services.NewShoppingListService(shoppingListItemRepo, usersToShoppingListItemRepo, userRepo)
	userService := services.NewUserService(userRepo)
	strikeService := services.NewStrikeService(dotRepo, banInfoRepo, userRepo)
	accessRequestService := services.NewAccessRequestService(accessRequestRepo)
	whitelistService := services.NewWhitelistService(whitelistRepo)

	go http.RunServer(
		notif,
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
	)

	notif.NotifyOnSignal(syscall.SIGINT, os.Interrupt)
	logger.Info("received shutdown signal, gracefully shutting down")
}
