package middleware

import "github.com/go-chi/chi/v5/middleware"

func Logger() Middleware {
	return middleware.Logger
}
