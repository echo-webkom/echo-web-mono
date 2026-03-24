package bootstrap

import (
	"context"
	"log"
	"os"
	"syscall"
	"uno/config"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http"
	"uno/infrastructure/external"
	sanityinfra "uno/infrastructure/external/sanity"
	"uno/infrastructure/filestorage"
	"uno/infrastructure/logging"
	"uno/infrastructure/postgres"
	"uno/pkg/adventofcode"
	"uno/pkg/sanity"

	"github.com/jesperkha/notifier"
)

func RunApi() {
	cfg := config.Load()
	notif := notifier.New()

	// Initialize structured logging
	logger := logging.NewWithConfig(cfg.Environment)
	logger.Info(context.Background(), "starting uno-api")

	// Initialize database connection
	db, err := postgres.New(cfg.DatabaseURL)
	if err != nil {
		logger.Error(context.Background(), "failed to connect to database", "error", err)
		log.Fatal(err)
	}
	logger.Info(context.Background(), "database connected")

	// Initialize Advent of Code client
	aocToken := os.Getenv("AOC_SESSION_COOKIE")
	aocClient := adventofcode.New(aocToken)
	if aocToken == "" {
		logger.Warn(context.Background(), "missing advent of code session token. endpoints will not work")
	}

	fileStorage, err := filestorage.New(cfg.ProfilePictureEndpointURL, cfg.ProfilePictureAccessKeyID, cfg.ProfilePictureSecretAccessKey)
	if err != nil {
		logger.Error(context.Background(), "failed to initialize file storage", "error", err)
	} else {
		logger.Info(context.Background(), "file storage connected")
	}

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
	adventOfCodeRepo := external.NewAdventOfCodeClient(aocClient, logger)
	groupRepo := postgres.NewGroupRepo(db, logger)
	reactionRepo := postgres.NewReactionRepo(db, logger)
	quoteRepo := postgres.NewQuoteRepo(db, logger)
	var profilePictureRepo port.ProfilePictureRepo
	if fileStorage != nil {
		profilePictureRepo, err = filestorage.NewProfilePictureStore(context.Background(), fileStorage, cfg.ProfilePictureBucketName, logger)
		if err != nil {
			logger.Error(context.Background(), "failed to initialize profile picture store", "error", err)
		}
	} else {
		logger.Warn(context.Background(), "file storage not configured, profile picture features disabled")
	}

	// Initialize Sanity client and CMS repos
	sanityClient, err := sanity.New(sanity.Config{
		ProjectID:  cfg.SanityProjectID,
		Dataset:    cfg.SanityDataset,
		APIVersion: cfg.SanityAPIVersion,
		Token:      cfg.SanityAPIToken,
	})
	if err != nil {
		logger.Error(context.Background(), "failed to create sanity client", "error", err)
		log.Fatal(err)
	}
	cmsHappeningRepo := sanityinfra.NewHappeningRepo(sanityClient, logger)
	cmsRepeatingHappeningRepo := sanityinfra.NewRepeatingHappeningRepo(sanityClient, logger)
	cmsPostRepo := sanityinfra.NewPostRepo(sanityClient, logger)
	cmsStudentGroupRepo := sanityinfra.NewStudentGroupRepo(sanityClient, logger)
	cmsJobAdRepo := sanityinfra.NewJobAdRepo(sanityClient, logger)
	cmsBannerRepo := sanityinfra.NewBannerRepo(sanityClient, logger)
	cmsStaticInfoRepo := sanityinfra.NewStaticInfoRepo(sanityClient, logger)
	cmsMerchRepo := sanityinfra.NewMerchRepo(sanityClient, logger)
	cmsMeetingMinuteRepo := sanityinfra.NewMeetingMinuteRepo(sanityClient, logger)
	cmsMovieRepo := sanityinfra.NewMovieRepo(sanityClient, logger)
	cmsHSApplicationRepo := sanityinfra.NewHSApplicationRepo(sanityClient, logger)

	// Initialize services
	authService := service.NewAuthService(sessionRepo, userRepo, cfg.AuthSecret)
	happeningService := service.NewHappeningService(happeningRepo, userRepo, registrationRepo, banInfoRepo, groupRepo)
	degreeService := service.NewDegreeService(degreeRepo)
	siteFeedbackService := service.NewSiteFeedbackService(siteFeedbackRepo)
	shoppingListService := service.NewShoppingListService(shoppingListItemRepo, usersToShoppingListItemRepo)
	userService := service.NewUserService(userRepo, profilePictureRepo)
	strikeService := service.NewStrikeService(dotRepo, banInfoRepo, userRepo)
	accessRequestService := service.NewAccessRequestService(accessRequestRepo)
	whitelistService := service.NewWhitelistService(whitelistRepo)
	commentService := service.NewCommentService(commentRepo)
	weatherService := service.NewWeatherService(weatherRepo)
	databrusService := service.NewDatabrusService(logger, databrusRepo)
	adventOfCodeService := service.NewAdventOfCodeService(adventOfCodeRepo)
	groupService := service.NewGroupService(groupRepo)
	reactionService := service.NewReactionService(reactionRepo)
	quoteService := service.NewQuoteService(quoteRepo)
	cmsService := service.NewCMSService(
		cmsHappeningRepo,
		cmsRepeatingHappeningRepo,
		cmsPostRepo,
		cmsStudentGroupRepo,
		cmsJobAdRepo,
		cmsBannerRepo,
		cmsStaticInfoRepo,
		cmsMerchRepo,
		cmsMeetingMinuteRepo,
		cmsMovieRepo,
		cmsHSApplicationRepo,
	)

	go http.RunServer(
		notif,
		logger,
		cfg,
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
		adventOfCodeService,
		groupService,
		reactionService,
		registrationRepo,
		quoteService,
		cmsService,
	)

	notif.NotifyOnSignal(syscall.SIGINT, os.Interrupt)
	logger.Info(context.Background(), "received shutdown signal, gracefully shutting down uno")
}
