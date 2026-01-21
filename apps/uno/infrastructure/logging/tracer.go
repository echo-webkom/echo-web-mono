package logging

import (
	"context"
	"log/slog"

	"github.com/google/uuid"
)

type tracer struct {
	traceId string
	spanId  string
}

func ContextWithTrace(ctx context.Context, span string) context.Context {
	return context.WithValue(ctx, tracer{}, tracer{
		traceId: uuid.NewString(),
		spanId:  span,
	})
}

type TraceHandler struct {
	next slog.Handler
}

func (h *TraceHandler) Enabled(ctx context.Context, level slog.Level) bool {
	return h.next.Enabled(ctx, level)
}

func (h *TraceHandler) Handle(ctx context.Context, r slog.Record) error {
	if tracer, ok := ctx.Value(tracer{}).(tracer); ok {
		r.AddAttrs(
			slog.String("trace_id", tracer.traceId),
			slog.String("span_id", tracer.spanId),
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
