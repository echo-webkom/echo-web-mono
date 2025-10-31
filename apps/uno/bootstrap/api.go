package bootstrap

import (
	"log"
	"os"
	"syscall"
	"uno/adapters/http"
	"uno/adapters/persistance/postgres"
	"uno/config"
	"uno/services"

	"github.com/jesperkha/notifier"
)

func RunApi() {
	config := config.Load()
	notif := notifier.New()

	db, err := postgres.New(config.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}

	// Setup repositories
	happeningRepoImpl := postgres.NewPostgresHappeningImpl(db)
	userRepoImpl := postgres.NewPostgresUserImpl(db)
	sessionRepoImpl := postgres.NewPostgresSessionImpl(db)
	questionRepoImpl := postgres.NewPostgresQuestionImpl(db)
	registrationRepoImpl := postgres.NewPostgresRegistrationImpl(db)
	spotRangeRepoImpl := postgres.NewPostgresSpotRangeImpl(db)

	// Setup services
	authService := services.NewAuthService(sessionRepoImpl, userRepoImpl)
	happeningService := services.NewHappeningService(happeningRepoImpl, registrationRepoImpl, spotRangeRepoImpl, questionRepoImpl)

	go http.RunServer(notif, config, authService, happeningService)

	notif.NotifyOnSignal(syscall.SIGINT, os.Interrupt)
}
