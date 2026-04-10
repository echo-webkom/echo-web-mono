package bootstrap

import (
	"context"
	"log"
	"net/http"
	"os"
	"syscall"
	"time"
	"uno/config"
	cronrunner "uno/cron"
	"uno/cron/jobs"
	"uno/domain/port"
	"uno/domain/service"
	sanityinfra "uno/infrastructure/external/sanity"
	"uno/infrastructure/filestorage"
	"uno/infrastructure/logging"
	"uno/infrastructure/postgres"
	"uno/pkg/sanity"

	"github.com/jesperkha/notifier"
)

func RunCron() {
	cfg := config.LoadCronConfig()
	notif := notifier.New()

	logger := logging.NewWithConfig(cfg.Environment)
	logger.Info(context.Background(), "starting uno-cron")

	db, err := postgres.New(cfg.DatabaseURL)
	if err != nil {
		logger.Error(context.Background(), "failed to connect to database", "error", err)
		return
	}
	defer func() {
		if err := db.Close(); err != nil {
			logger.Error(context.Background(), "failed to close database", "error", err)
		}
	}()

	location, err := time.LoadLocation(cfg.CronTimezone)
	if err != nil {
		logger.Error(context.Background(), "invalid cron timezone", "timezone", cfg.CronTimezone, "error", err)
		return
	}

	fileStorage, err := filestorage.New(cfg.ProfilePictureEndpointURL, cfg.ProfilePictureAccessKeyID, cfg.ProfilePictureSecretAccessKey)
	if err != nil {
		logger.Error(context.Background(), "failed to initialize file storage", "error", err)
	} else {
		logger.Info(context.Background(), "file storage connected")
	}

	// Initialize Redis client (falls back to in-memory cache if not configured)
	redisClient, cacheInvalidator := initRedis(cfg.RedisURL, logger)

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
	cmsService := service.NewCMSService(
		cmsHappeningRepo,
		nil,
		nil,
		nil,
		nil,
		nil,
		nil,
		nil,
		nil,
		nil,
		nil,
		cacheInvalidator,
	)

	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	runner := cronrunner.New(logger, location)
	questionRepo := postgres.NewQuestionRepo(db, logger)
	dotRepo := postgres.NewDotRepo(db, logger)
	banInfoRepo := postgres.NewBanInfoRepo(db, logger)
	userRepo := postgres.NewUserRepo(db, logger)
	kvRepo := postgres.NewKVRepo(db, logger)
	var profilePictureRepo port.ProfilePictureRepo
	if fileStorage != nil {
		profilePictureRepo, err = filestorage.NewProfilePictureStore(context.Background(), fileStorage, cfg.ProfilePictureBucketName, logger)
		if err != nil {
			logger.Error(context.Background(), "failed to initialize profile picture store", "error", err)
		}
	} else {
		logger.Warn(context.Background(), "file storage not configured, profile picture features disabled")
	}
	questionService := service.NewQuestionService(questionRepo)
	strikeService := service.NewStrikeService(dotRepo, banInfoRepo, userRepo)
	userService := service.NewUserService(userRepo, profilePictureRepo)

	// Job to clean up sensitive questions and strikes every 6 months.
	runner.AddSchedule(cronrunner.Schedule{
		Name: "cleanup_sensitive_questions",
		Spec: "0 0 1 1,7 *",
		Job:  jobs.NewCleanupSensitiveQuestions(questionService, logger),
	})
	// Job to clean up old strikes every 6 months.
	runner.AddSchedule(cronrunner.Schedule{
		Name: "cleanup_old_strikes",
		Spec: "0 0 1 1,7 *",
		Job:  jobs.NewCleanupOldStrikes(strikeService, logger),
	})
	// Job to reset user years on July 1st every year.
	runner.AddSchedule(cronrunner.Schedule{
		Name: "reset_user_years",
		Spec: "0 0 1 7 *",
		Job:  jobs.NewResetUserYears(userService, logger),
	})
	// Job to clean up expired key-value pairs daily
	runner.AddSchedule(cronrunner.Schedule{
		Name: "cleanup_expired_kv",
		Spec: "0 0 * * *",
		Job:  jobs.NewCleanupExpiredKV(kvRepo, logger),
	})
	// Job to close programmer bar every day at 2am.
	runner.AddSchedule(cronrunner.Schedule{
		Name: "close_programmer_bar",
		Spec: "0 2 * * *",
		Job:  jobs.NewCloseProgrammerBar(client, logger),
	})
	// Job to unban users by cleaning expired strikes/bans every day at 2am.
	runner.AddSchedule(cronrunner.Schedule{
		Name: "unban_users_db_maintenance",
		Spec: "0 2 * * *",
		Job:  jobs.NewModerationCleanup(strikeService),
	})
	// Job to unpin happenings after registration end every hour.
	runner.AddSchedule(cronrunner.Schedule{
		Name: "unpin_happenings_after_registration_end",
		Spec: "0 * * * *",
		Job:  jobs.NewUnpinHappeningsAfterRegistrationEnd(logger, cmsService),
	})

	if err := runner.Start(); err != nil {
		logger.Error(context.Background(), "failed to start cron runner", "error", err)
		return
	}
	defer runner.Stop()

	notif.NotifyOnSignal(syscall.SIGINT, os.Interrupt)
	logger.Info(context.Background(), "received shutdown signal, gracefully shutting down cron")
}
