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
	admin := router.NewAuthMiddleware(repo)

	r.Handle("GET", "/happenings", api.GetHappeningsHandler(repo))
	r.Handle("GET", "/happenings/{id}", api.GetHappeningById(repo))
	r.Handle("GET", "/happenings/{id}/questions", api.GetHappeningQuestions(repo))
	r.Handle("GET", "/happenings/{id}/registrations/count", api.GetHappeningRegistrationsCount(repo))

	// Admin
	r.Handle("GET", "/happenings/{id}/registrations", api.GetHappeningRegistrations(repo), admin)
	r.Handle("GET", "/happenings/{id}/spot-ranges", api.GetHappeningSpotRanges(repo), admin)

	r.Serve(notif, config.ApiPort)
}
