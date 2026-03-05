package logging

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"log/slog"
)

type logContextKey int

const (
	traceIDKey logContextKey = iota
	spanIDKey
	userIDKey
	isAdminKey
)

func WithTraceID(ctx context.Context, traceID string) context.Context {
	return context.WithValue(ctx, traceIDKey, traceID)
}

func WithSpanID(ctx context.Context, spanID string) context.Context {
	return context.WithValue(ctx, spanIDKey, spanID)
}

func WithUserID(ctx context.Context, userID string) context.Context {
	return context.WithValue(ctx, userIDKey, userID)
}

func WithIsAdmin(ctx context.Context) context.Context {
	return context.WithValue(ctx, isAdminKey, true)
}

// GenerateTraceID generates a random 16-byte trace ID as a hex string
func GenerateTraceID() string {
	b := make([]byte, 16)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

// GenerateSpanID generates a random 8-byte span ID as a hex string
func GenerateSpanID() string {
	b := make([]byte, 8)
	_, _ = rand.Read(b)
	return hex.EncodeToString(b)
}

// TraceHandler is a slog.Handler that adds trace information from the context to log records
type TraceHandler struct {
	next slog.Handler
}

func (h *TraceHandler) Enabled(ctx context.Context, level slog.Level) bool {
	return h.next.Enabled(ctx, level)
}

func (h *TraceHandler) Handle(ctx context.Context, r slog.Record) error {
	if traceID, ok := ctx.Value(traceIDKey).(string); ok && traceID != "" {
		r.AddAttrs(slog.String("trace_id", traceID))
	}
	if userID, ok := ctx.Value(userIDKey).(string); ok && userID != "" {
		r.AddAttrs(slog.String("user_id", userID))
	}
	if isAdmin, ok := ctx.Value(isAdminKey).(bool); ok && isAdmin {
		r.AddAttrs(slog.Bool("is_admin", true))
	}

	return h.next.Handle(ctx, r)
}

func (h *TraceHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return &TraceHandler{next: h.next.WithAttrs(attrs)}
}

func (h *TraceHandler) WithGroup(name string) slog.Handler {
	return &TraceHandler{next: h.next.WithGroup(name)}
}
