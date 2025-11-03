package router

import (
	"log/slog"
	"net/http"
	"uno/domain/ports"

	"github.com/go-chi/httplog/v3"
)

func RequestLogger(logger ports.Logger) func(next http.Handler) http.Handler {
	return httplog.RequestLogger(logger.Slog(), &httplog.Options{
		Level:             slog.LevelInfo,
		Schema:            httplog.SchemaECS,
		RecoverPanics:     true,
		LogRequestHeaders: []string{"Origin", "User-Agent"},
	})
}
