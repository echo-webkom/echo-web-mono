package api

import (
	"errors"
	"net/http"

	"github.com/echo-webkom/axis/apiutil"
	"github.com/echo-webkom/axis/service/whitelist"
)

func WhitelistRouter(h *apiutil.Handler) *apiutil.Router {
	r := apiutil.NewRouter()
	ws := whitelist.New(h.Pool)

	// GET /whitelist
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		whitelists, err := ws.ListWhitelist(ctx)
		if err != nil {
			h.Error(w, http.StatusInternalServerError, errors.New("failed to list whitelists"))
			return
		}

		h.JSON(w, http.StatusOK, whitelists)
	})

	// GET /whitelist/{email}
	r.Get("/{email}", func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		email := r.URL.Query().Get("email")
		if email == "" {
			h.Error(w, http.StatusBadRequest, errors.New("email is required"))
			return
		}

		whitelist, err := ws.GetWhitelist(ctx, email)
		if err != nil {
			h.Error(w, http.StatusNotFound, errors.New("email not found"))
			return
		}

		h.JSON(w, http.StatusOK, whitelist)
	})

	return r
}
