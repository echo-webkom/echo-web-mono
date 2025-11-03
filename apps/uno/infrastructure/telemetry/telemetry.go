package telemetry

import (
	"context"
	"strings"

	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/exporters/otlp/otlptrace/otlptracehttp"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.24.0"
	"go.opentelemetry.io/otel/trace"
)

type TelemetryConfig struct {
	ServiceName    string
	ServiceVersion string
	Environment    string
	OTLPEndpoint   string
	OTLPHeaders    string
	Enabled        bool
}

func New(cfg TelemetryConfig) (func(context.Context) error, error) {
	if !cfg.Enabled {
		return func(context.Context) error { return nil }, nil
	}

	ctx := context.Background()

	// Configure exporter options based on environment
	opts := []otlptracehttp.Option{
		otlptracehttp.WithEndpoint(cfg.OTLPEndpoint),
	}

	if cfg.Environment == "development" || cfg.Environment == "dev" {
		// Use insecure connection in development
		opts = append(opts, otlptracehttp.WithInsecure())
	} else {
		// Use secure connection with headers in production
		if cfg.OTLPHeaders != "" {
			opts = append(opts, otlptracehttp.WithHeaders(parseHeaders(cfg.OTLPHeaders)))
		}
	}

	exporter, err := otlptracehttp.New(ctx, opts...)
	if err != nil {
		return nil, err
	}

	res, err := resource.New(ctx,
		resource.WithAttributes(
			semconv.ServiceNameKey.String(cfg.ServiceName),
			semconv.ServiceVersionKey.String(cfg.ServiceVersion),
			semconv.DeploymentEnvironmentKey.String(cfg.Environment),
		),
	)
	if err != nil {
		return nil, err
	}

	tp := sdktrace.NewTracerProvider(
		sdktrace.WithBatcher(exporter),
		sdktrace.WithResource(res),
		sdktrace.WithSampler(sdktrace.AlwaysSample()),
	)

	otel.SetTracerProvider(tp)

	otel.SetTextMapPropagator(propagation.NewCompositeTextMapPropagator(
		propagation.TraceContext{},
		propagation.Baggage{},
	))

	return tp.Shutdown, nil
}

func Tracer(name string) trace.Tracer {
	return otel.Tracer(name)
}

func parseHeaders(headerStr string) map[string]string {
	headers := make(map[string]string)
	pairs := splitAndTrim(headerStr, ",")
	for _, pair := range pairs {
		kv := splitAndTrim(pair, "=")
		if len(kv) == 2 {
			headers[kv[0]] = kv[1]
		}
	}
	return headers
}
func splitAndTrim(s string, sep string) []string {
	if s == "" {
		return []string{}
	}
	raw := strings.Split(s, sep)
	result := make([]string, 0, len(raw))
	for _, part := range raw {
		part = strings.TrimSpace(part)
		if part != "" {
			result = append(result, part)
		}
	}
	return result
}
