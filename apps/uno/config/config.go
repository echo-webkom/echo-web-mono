package config

import (
	"log"
	"os"

	"github.com/echo-webkom/cenv"
)

type Config struct {
	DatabaseURL      string
	ApiPort          string
	AdminAPIKey      string
	OTLPEndpoint     string
	OTLPHeaders      string
	Environment      string
	ServiceName      string
	ServiceVersion   string
	TelemetryEnabled bool
}

func Load() *Config {
	environment := getEnvOrDefault("ENVIRONMENT", "development")

	if environment != "production" {
		if err := cenv.VerifyEx("../../.env", "../../cenv.schema.json"); err != nil {
			log.Fatal(err)
		}
	}

	return &Config{
		DatabaseURL:      os.Getenv("DATABASE_URL"),
		ApiPort:          os.Getenv("UNO_API_PORT"),
		AdminAPIKey:      os.Getenv("ADMIN_KEY"),
		Environment:      environment,
		ServiceName:      getEnvOrDefault("SERVICE_NAME", "uno-api"),
		TelemetryEnabled: getEnvOrDefault("TELEMETRY_ENABLED", "true") == "true",
		OTLPEndpoint:     os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT"),
	}
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
