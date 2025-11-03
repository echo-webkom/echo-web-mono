package config

import (
	"os"
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

	// if err := cenv.LoadEx("../../.env", "../../cenv.schema.json"); err != nil {
	// 	if environment != "production" {
	// 		log.Fatalf("Error loading .env file: %v", err)
	// 	}
	// }

	return &Config{
		DatabaseURL:      os.Getenv("DATABASE_URL"),
		ApiPort:          ":" + getEnvOrDefault("UNO_API_PORT", "8080"),
		AdminAPIKey:      os.Getenv("ADMIN_KEY"),
		OTLPEndpoint:     getEnvOrDefault("OTEL_EXPORTER_OTLP_ENDPOINT", "localhost:4317"),
		OTLPHeaders:      os.Getenv("OTEL_EXPORTER_OTLP_HEADERS"),
		Environment:      environment,
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
