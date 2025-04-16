package server

import (
	"github.com/echo-webkom/axis/apps/happening"
	"github.com/echo-webkom/axis/apps/shoppinglist"
	"github.com/echo-webkom/axis/apputil"
)

func mount(rf *apputil.RouterFactory) {
	rf.Mount("/happening", happening.Router)
	rf.Mount("/shopping-list", shoppinglist.Router)
}
