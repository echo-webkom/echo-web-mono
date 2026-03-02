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

type CronConfig struct {
	DatabaseURL      string
	CronTimezone     string
	Environment      string
	ServiceName      string
	TelemetryEnabled bool
}

func Load() *Config {
	environment := getEnvOrDefault("ENVIRONMENT", "development")

	if environment == "development" {
		if err := cenv.VerifyEx("../../.env", "../../cenv.schema.json"); err != nil {
			log.Println(err)
		}
	}

	return &Config{
		DatabaseURL:      os.Getenv("DATABASE_URL"),
		ApiPort:          toGoPort(os.Getenv("UNO_API_PORT")),
		AdminAPIKey:      os.Getenv("ADMIN_KEY"),
		Environment:      environment,
		ServiceName:      getEnvOrDefault("SERVICE_NAME", "uno-api"),
		TelemetryEnabled: getEnvOrDefault("TELEMETRY_ENABLED", "false") == "true",
		OTLPEndpoint:     os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT"),
	}
}

func LoadCronConfig() *CronConfig {
	environment := getEnvOrDefault("ENVIRONMENT", "development")

	if environment == "development" {
		if err := cenv.VerifyEx("../../.env", "../../cenv.schema.json"); err != nil {
			log.Println(err)
		}
	}

	return &CronConfig{
		DatabaseURL:      os.Getenv("DATABASE_URL"),
		CronTimezone:     getEnvOrDefault("CRON_TIMEZONE", "Europe/Oslo"),
		Environment:      environment,
		ServiceName:      getEnvOrDefault("SERVICE_NAME", "uno-cron"),
		TelemetryEnabled: getEnvOrDefault("TELEMETRY_ENABLED", "false") == "true",
	}
}

func toGoPort(port string) string {
	if len(port) > 0 && port[0] == ':' {
		return port
	}
	return ":" + port
}

func getEnvOrDefault(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
