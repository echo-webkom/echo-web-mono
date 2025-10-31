package http

import (
	"uno/adapters/http/router"
	"uno/adapters/http/routes/api"
	"uno/config"
	"uno/services"

	"github.com/jesperkha/notifier"
)

func RunServer(notif *notifier.Notifier, config *config.Config, as *services.AuthService, hs *services.HappeningService) {
	r := router.New()
	admin := router.NewAuthMiddleware(as)

	r.Handle("GET", "/happenings", api.GetHappeningsHandler(hs))
	r.Handle("GET", "/happenings/{id}", api.GetHappeningById(hs))
	r.Handle("GET", "/happenings/{id}/questions", api.GetHappeningQuestions(hs))
	r.Handle("GET", "/happenings/{id}/registrations/count", api.GetHappeningRegistrationsCount(hs))

	// Admin
	r.Handle("GET", "/happenings/{id}/registrations", api.GetHappeningRegistrations(hs), admin)
	r.Handle("GET", "/happenings/{id}/spot-ranges", api.GetHappeningSpotRanges(hs), admin)

	r.Serve(notif, config.ApiPort)
}
