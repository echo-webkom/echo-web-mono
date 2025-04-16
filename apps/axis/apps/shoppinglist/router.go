package shoppinglist

import (
	"github.com/echo-webkom/axis/apputil"
)

func Router(h *apputil.Handler) *apputil.Router {
	r := apputil.NewRouter()

	r.Get("/", listShoppingItems(h))
	r.Post("/", createShoppingItem(h))

	return r
}
