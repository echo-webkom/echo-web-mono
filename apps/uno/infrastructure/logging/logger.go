package logging

import (
	"context"
	"log/slog"
	"os"
	"time"
	"uno/domain/port"

	"github.com/lmittmann/tint"
)

type SlogAdapter struct {
	logger *slog.Logger
}

func New(logger *slog.Logger) port.Logger {
	return &SlogAdapter{
		logger: logger,
	}
}

func NewWithConfig(env string) port.Logger {
	var baseHandler slog.Handler

	if env == "production" {
		baseHandler = slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
			Level: slog.LevelInfo,
		})
	} else {
		baseHandler = tint.NewHandler(os.Stdout, &tint.Options{
			Level:      slog.LevelDebug,
			TimeFormat: time.Kitchen,
			AddSource:  false,
		})
	}

	handler := &TraceHandler{next: baseHandler}

	logger := slog.New(handler)
	slog.SetDefault(logger)

	return &SlogAdapter{logger: logger}
}

// Debug logs a debug message with trace context if available
// Should be used for information that could be helpful in diagnosing issues
func (s *SlogAdapter) Debug(ctx context.Context, msg string, args ...any) {
	s.logger.DebugContext(ctx, msg, args...)
}

// Info logs an info message with trace context if available
// Should be used for general operational entries about the application
func (s *SlogAdapter) Info(ctx context.Context, msg string, args ...any) {
	s.logger.InfoContext(ctx, msg, args...)
}

// Warn logs a warning message with trace context if available
// Should be used for events that might indicate a potential issue
func (s *SlogAdapter) Warn(ctx context.Context, msg string, args ...any) {
	s.logger.WarnContext(ctx, msg, args...)
}

// Error logs an error message with trace context if available
// Should be used for errors that need immediate attention
func (s *SlogAdapter) Error(ctx context.Context, msg string, args ...any) {
	s.logger.ErrorContext(ctx, msg, args...)
}

// Fatal logs an error message with trace context if available and exits with status 1.
// Should be used for errors that are fatal
func (s *SlogAdapter) Fatal(ctx context.Context, msg string, args ...any) {
	s.logger.ErrorContext(ctx, msg, args...)
	os.Exit(1)
}

// With creates a new logger with additional context
func (s *SlogAdapter) With(args ...any) port.Logger {
	return &SlogAdapter{
		logger: s.logger.With(args...),
	}
}

// Unwraps the underlying slog.Logger
func (s *SlogAdapter) Slog() *slog.Logger {
	return s.logger
}

// CronLogger adapts port.Logger to the interface expected by robfig/cron.
type CronLogger struct {
	logger port.Logger
}

func NewCronLogger(logger port.Logger) *CronLogger {
	return &CronLogger{logger: logger}
}

func (c *CronLogger) Info(msg string, keysAndValues ...any) {
	c.logger.Info(context.Background(), msg, keysAndValues...)
}

func (c *CronLogger) Error(err error, msg string, keysAndValues ...any) {
	c.logger.Error(context.Background(), msg, append(keysAndValues, "error", err)...)
}
