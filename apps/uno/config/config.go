package config

import (
	"log"
	"os"

	"github.com/echo-webkom/cenv"
)

type Config struct {
	DatabaseURL      string
	ApiPort          string
	OTLPEndpoint     string
	Environment      string
	ServiceName      string
	ServiceVersion   string
	TelemetryEnabled bool
}

func Load() *Config {
	if err := cenv.Verify(); err != nil {
		log.Fatal(err)
	}

	return &Config{
		DatabaseURL:      os.Getenv("DATABASE_URL"),
		ApiPort:          os.Getenv("UNO_API_PORT"),
		OTLPEndpoint:     getEnvOrDefault("OTEL_EXPORTER_OTLP_ENDPOINT", "localhost:4317"),
		Environment:      getEnvOrDefault("ENVIRONMENT", "development"),
		ServiceName:      getEnvOrDefault("SERVICE_NAME", "uno-api"),
		ServiceVersion:   getEnvOrDefault("SERVICE_VERSION", "1.0.0"),
		TelemetryEnabled: getEnvOrDefault("TELEMETRY_ENABLED", "true") == "true",
	}
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
