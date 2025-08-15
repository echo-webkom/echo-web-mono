package middleware

import "github.com/go-chi/chi/middleware"

func Logger() Middleware {
	return middleware.Logger
}
