package logging

import (
	"context"
	"log/slog"
	"os"
	"uno/domain/port"

	"go.opentelemetry.io/otel/trace"
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
	var handler slog.Handler
	opts := &slog.HandlerOptions{
		Level: slog.LevelInfo,
	}

	if env == "production" {
		handler = slog.NewJSONHandler(os.Stdout, opts)
	} else {
		handler = slog.NewTextHandler(os.Stdout, opts)
	}

	logger := slog.New(handler)
	slog.SetDefault(logger)

	return &SlogAdapter{
		logger: logger,
	}
}

// Debug logs a debug message with trace context if available
// Should be used for information that could be helpful in diagnosing issues
func (s *SlogAdapter) Debug(ctx context.Context, msg string, args ...any) {
	args = s.withTraceContext(ctx, args...)
	s.logger.DebugContext(ctx, msg, args...)
}

// Info logs an info message with trace context if available
// Should be used for general operational entries about the application
func (s *SlogAdapter) Info(ctx context.Context, msg string, args ...any) {
	args = s.withTraceContext(ctx, args...)
	s.logger.InfoContext(ctx, msg, args...)
}

// Warn logs a warning message with trace context if available
// Should be used for events that might indicate a potential issue
func (s *SlogAdapter) Warn(ctx context.Context, msg string, args ...any) {
	args = s.withTraceContext(ctx, args...)
	s.logger.WarnContext(ctx, msg, args...)
}

// Error logs an error message with trace context if available
// Should be used for errors that need immediate attention
func (s *SlogAdapter) Error(ctx context.Context, msg string, args ...any) {
	args = s.withTraceContext(ctx, args...)
	s.logger.ErrorContext(ctx, msg, args...)
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

// withTraceContext adds OpenTelemetry trace context to log arguments
func (s *SlogAdapter) withTraceContext(ctx context.Context, args ...any) []any {
	span := trace.SpanFromContext(ctx)
	if !span.IsRecording() {
		return args
	}

	spanCtx := span.SpanContext()
	traceArgs := []any{
		"trace_id", spanCtx.TraceID().String(),
		"span_id", spanCtx.SpanID().String(),
	}

	return append(traceArgs, args...)
}
