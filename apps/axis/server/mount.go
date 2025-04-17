package server

import (
	"github.com/echo-webkom/axis/api"
	"github.com/echo-webkom/axis/apiutil"
)

// Mounts the different routers to the main router.
func mount(rf *apiutil.RouterFactory) {
	rf.Mount("/happening", api.HappeningRouter)
	rf.Mount("/shopping-list", api.ShoppingListRouter)
	rf.Mount("/feedback", api.FeedbackRouter)
	rf.Mount("/auth", api.AuthRouter)
	rf.Mount("/whitelist", api.WhitelistRouter)
}
