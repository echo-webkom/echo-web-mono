package routes

import (
	"net/http"

	"github.com/echo-webkom/uno/pkg/middleware"
	"github.com/go-chi/chi/v5"
)

func (r *Router) CommentRoutes() http.Handler {
	m := chi.NewMux()
	m.Use(middleware.AdminAuth(r.config))

	m.Get("/{id}", r.getCommentsByID)

	return m
}

func (rt *Router) getCommentsByID(w http.ResponseWriter, r *http.Request) {
	ctx := r.Context()
	id := r.PathValue("id")

	comments, err := rt.cs.GetCommentsByHappeningID(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	JSON(w, comments)
}
