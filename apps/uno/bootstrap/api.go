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

	db, err := postgres.New(config.DatabaseURL)
	if err != nil {
		logger.Error("failed to connect to database", "error", err)
		log.Fatal(err)
	}
	logger.Info("database connected")

	// Initialize repositories
	happeningRepoImpl := postgres.NewPostgresHappeningImpl(db)
	userRepoImpl := postgres.NewPostgresUserImpl(db)
	sessionRepoImpl := postgres.NewPostgresSessionImpl(db)
	questionRepoImpl := postgres.NewPostgresQuestionImpl(db)
	registrationRepoImpl := postgres.NewPostgresRegistrationImpl(db)
	spotRangeRepoImpl := postgres.NewPostgresSpotRangeImpl(db)
	degreeRepoImpl := postgres.NewPostgresDegreeImpl(db)
	siteFeedbackRepoImpl := postgres.NewPostgresSiteFeedbackImpl(db)
	shoppingListItemRepoImpl := postgres.NewPostgresShoppingListItemImpl(db)
	usersToShoppingListItemRepoImpl := postgres.NewPostgresUsersToShoppingListItemImpl(db)

	// Initialize services
	authService := services.NewAuthService(sessionRepoImpl, userRepoImpl)
	happeningService := services.NewHappeningService(happeningRepoImpl, registrationRepoImpl, spotRangeRepoImpl, questionRepoImpl)
	degreeService := services.NewDegreeService(degreeRepoImpl)
	siteFeedbackService := services.NewSiteFeedbackService(siteFeedbackRepoImpl)
	shoppingListService := services.NewShoppingListService(shoppingListItemRepoImpl, usersToShoppingListItemRepoImpl, userRepoImpl)
	userService := services.NewUserService(userRepoImpl)

	go http.RunServer(
		notif,
		config,
		authService,
		happeningService,
		degreeService,
		siteFeedbackService,
		shoppingListService,
		userService,
	)

	notif.NotifyOnSignal(syscall.SIGINT, os.Interrupt)
	logger.Info("received shutdown signal, gracefully shutting down")
}
