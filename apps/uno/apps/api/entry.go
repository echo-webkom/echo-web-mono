package api

import (
	"uno/config"
	"uno/data/repo"
	"uno/http/router"
	"uno/http/routes/api"

	"github.com/jesperkha/notifier"
)

func Run(notif *notifier.Notifier, config *config.Config, repo *repo.Repo) {
	r := router.New()

	r.Handle("GET", "/happenings", api.GetHappeningsHandler(repo))

	r.Serve(notif, config.ApiPort)
}
