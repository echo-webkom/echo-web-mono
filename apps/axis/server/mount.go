package server

import (
	"github.com/echo-webkom/axis/apps/feedback"
	"github.com/echo-webkom/axis/apps/happening"
	"github.com/echo-webkom/axis/apps/shoppinglist"
	"github.com/echo-webkom/axis/apputil"
)

// Mounts the different routers to the main router.
func mount(rf *apputil.RouterFactory) {
	rf.Mount("/happening", happening.Router)
	rf.Mount("/shopping-list", shoppinglist.Router)
	rf.Mount("/feedback", feedback.Router)
}
