package shoppinglist

import (
	"github.com/echo-webkom/axis/apputil"
	"github.com/go-chi/chi/v5"
)

func Router(h *apputil.Handler) chi.Router {
	r := chi.NewRouter()

	r.Get("/", listShoppingItems(h))
	r.Post("/", createShoppingItem(h))

	return r
}
