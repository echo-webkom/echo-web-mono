package bootstrap

import (
	"context"
	"log"
	"os"
	"syscall"
	"uno/config"
	"uno/domain/port"
	"uno/domain/service"
	"uno/domain/service/providers"
	"uno/http"
	"uno/infrastructure/cache"
	"uno/infrastructure/external"
	sanityinfra "uno/infrastructure/external/sanity"
	"uno/infrastructure/filestorage"
	"uno/infrastructure/logging"
	"uno/infrastructure/postgres"
	"uno/pkg/adventofcode"
	"uno/pkg/sanity"

	"github.com/jesperkha/notifier"
	"github.com/redis/go-redis/v9"
)

func RunApi() {
	cfg := config.Load()
	notif := notifier.New()

	// Initialize structured logging
	logger := logging.NewWithConfig(cfg.Environment)
	logger.Info(context.Background(), "starting uno-api")

	// Initialize database connection
	db := initDatabase(cfg.DatabaseURL, logger)

	// Initialize Redis client (falls back to in-memory cache if not configured)
	redisClient, cacheInvalidator := initRedis(cfg.RedisURL, logger)

	// Initialize Advent of Code client
	aocClient := initAdventOfCode(logger)

	profilePictureRepo := initFileStorage(cfg, logger)

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
	weatherRepo := external.NewYrRepo(logger, redisClient)
	databrusRepo := external.NewDatabrusRepo(logger, redisClient)
	adventOfCodeRepo := external.NewAdventOfCodeClient(aocClient, logger, redisClient)
	groupRepo := postgres.NewGroupRepo(db, logger)
	reactionRepo := postgres.NewReactionRepo(db, logger)
	quoteRepo := postgres.NewQuoteRepo(db, logger)
	accountRepo := postgres.NewAccountRepo(db, logger)
	verificationTokenRepo := postgres.NewVerificationTokenRepo(db, logger)

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
	cmsHappeningRepo := sanityinfra.NewHappeningRepo(sanityClient, logger, redisClient)
	cmsRepeatingHappeningRepo := sanityinfra.NewRepeatingHappeningRepo(sanityClient, logger, redisClient)
	cmsPostRepo := sanityinfra.NewPostRepo(sanityClient, logger, redisClient)
	cmsStudentGroupRepo := sanityinfra.NewStudentGroupRepo(sanityClient, logger, redisClient)
	cmsJobAdRepo := sanityinfra.NewJobAdRepo(sanityClient, logger, redisClient)
	cmsBannerRepo := sanityinfra.NewBannerRepo(sanityClient, logger, redisClient)
	cmsStaticInfoRepo := sanityinfra.NewStaticInfoRepo(sanityClient, logger, redisClient)
	cmsMerchRepo := sanityinfra.NewMerchRepo(sanityClient, logger, redisClient)
	cmsMeetingMinuteRepo := sanityinfra.NewMeetingMinuteRepo(sanityClient, logger, redisClient)
	cmsMovieRepo := sanityinfra.NewMovieRepo(sanityClient, logger, redisClient)
	cmsHSApplicationRepo := sanityinfra.NewHSApplicationRepo(sanityClient, logger, redisClient)

	// Initialize services
	feideProvider := providers.NewFeideProvider(providers.FeideConfig{
		ClientID:     cfg.FeideClientID,
		ClientSecret: cfg.FeideClientSecret,
		CallbackURL:  cfg.UnoBaseURL + "/auth/callback/feide",
	})
	authService := service.NewAuthService(service.AuthServiceConfig{
		SessionRepo:           sessionRepo,
		UserRepo:              userRepo,
		AuthSecret:            cfg.AuthSecret,
		FeideProvider:         feideProvider,
		WhitelistRepo:         whitelistRepo,
		AccountRepo:           accountRepo,
		VerificationTokenRepo: verificationTokenRepo,
		SignInAttemptCache:    cache.NewCache[service.SignInAttempt](redisClient, "sign-in-attempt", logger),
	})
	happeningService := service.NewHappeningService(happeningRepo, userRepo, registrationRepo, banInfoRepo, groupRepo)
	degreeService := service.NewDegreeService(degreeRepo)
	siteFeedbackService := service.NewSiteFeedbackService(siteFeedbackRepo)
	shoppingListService := service.NewShoppingListService(shoppingListItemRepo, usersToShoppingListItemRepo)
	userService := service.NewUserService(userRepo, profilePictureRepo, groupRepo, degreeRepo)
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
		cacheInvalidator,
	)

	go http.RunServer(http.ServerDeps{
		Notifier: notif,

		Logger: logger,
		Config: cfg,

		FeideProvider: feideProvider,

		AuthService:          authService,
		HappeningService:     happeningService,
		DegreeService:        degreeService,
		SiteFeedbackService:  siteFeedbackService,
		ShoppingListService:  shoppingListService,
		UserService:          userService,
		StrikeSerivce:        strikeService,
		AccessRequestService: accessRequestService,
		WhitelistService:     whitelistService,
		CommentService:       commentService,
		WeatherService:       weatherService,
		DatabrusService:      databrusService,
		AdventOfCodeService:  adventOfCodeService,
		GroupService:         groupService,
		ReactionService:      reactionService,
		QuoteService:         quoteService,
		CMSService:           cmsService,
	})

	notif.NotifyOnSignal(syscall.SIGINT, os.Interrupt)
	logger.Info(context.Background(), "received shutdown signal, gracefully shutting down uno")
}

func initAdventOfCode(logger port.Logger) *adventofcode.Client {
	token := os.Getenv("AOC_SESSION_COOKIE")
	if token == "" {
		logger.Warn(context.Background(), "missing advent of code session token. endpoints will not work")
	}
	return adventofcode.New(token)
}

func initDatabase(databaseURL string, logger port.Logger) *postgres.Database {
	db, err := postgres.New(databaseURL)
	if err != nil {
		logger.Error(context.Background(), "failed to connect to database", "error", err)
		log.Fatal(err)
	}
	logger.Info(context.Background(), "database connected")
	return db
}

func initFileStorage(cfg *config.Config, logger port.Logger) port.ProfilePictureRepo {
	fs, err := filestorage.New(cfg.ProfilePictureEndpointURL, cfg.ProfilePictureAccessKeyID, cfg.ProfilePictureSecretAccessKey)
	if err != nil {
		logger.Error(context.Background(), "failed to initialize file storage", "error", err)
		logger.Warn(context.Background(), "file storage not configured, profile picture features disabled")
		return nil
	}
	logger.Info(context.Background(), "file storage connected")

	repo, err := filestorage.NewProfilePictureStore(context.Background(), fs, cfg.ProfilePictureBucketName, logger)
	if err != nil {
		logger.Error(context.Background(), "failed to initialize profile picture store", "error", err)
		return nil
	}
	return repo
}

func initRedis(redisURL string, logger port.Logger) (*redis.Client, port.CacheInvalidator) {
	if redisURL == "" {
		logger.Warn(context.Background(), "redis not configured, using in-memory cache")
		return nil, cache.NoopInvalidator{}
	}

	opt, err := redis.ParseURL(redisURL)
	if err != nil {
		logger.Error(context.Background(), "failed to parse redis url", "error", err)
		logger.Warn(context.Background(), "redis not configured, using in-memory cache")
		return nil, cache.NoopInvalidator{}
	}

	client := redis.NewClient(opt)
	logger.Info(context.Background(), "redis connected")
	return client, cache.NewRedisInvalidator(logger, client)
}
