package logging

import (
	"context"
	"log/slog"

	"go.opentelemetry.io/otel/trace"
)

type TraceHandler struct {
	next slog.Handler
}

func (h *TraceHandler) Enabled(ctx context.Context, level slog.Level) bool {
	return h.next.Enabled(ctx, level)
}

func (h *TraceHandler) Handle(ctx context.Context, r slog.Record) error {
	spanCtx := trace.SpanContextFromContext(ctx)
	if spanCtx.IsValid() {
		r.AddAttrs(
			slog.String("trace_id", spanCtx.TraceID().String()),
			slog.String("span_id", spanCtx.SpanID().String()),
		)
	}

	return h.next.Handle(ctx, r)
}

func (h *TraceHandler) WithAttrs(attrs []slog.Attr) slog.Handler {
	return &TraceHandler{next: h.next.WithAttrs(attrs)}
}

func (h *TraceHandler) WithGroup(name string) slog.Handler {
	return &TraceHandler{next: h.next.WithGroup(name)}
}
