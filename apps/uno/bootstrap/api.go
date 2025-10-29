package bootstrap

import (
	"log"
	"os"
	"syscall"
	"uno/apps/api"
	"uno/config"
	"uno/data/database"
	"uno/data/repo"

	"github.com/jesperkha/notifier"
)

func RunApi() {
	config := config.Load()
	notif := notifier.New()

	db, err := database.New(config.DatabaseURL)
	if err != nil {
		log.Fatal(err)
	}

	repo := repo.New(db.DB)

	go api.Run(notif, config, repo)

	notif.NotifyOnSignal(syscall.SIGINT, os.Interrupt)
}
