package config

import (
	"log"
	"os"

	"github.com/echo-webkom/cenv"
)

type Config struct {
	DatabaseURL                   string
	ApiPort                       string
	AdminAPIKey                   string
	OTLPEndpoint                  string
	OTLPHeaders                   string
	Environment                   string
	ServiceName                   string
	ServiceVersion                string
	TelemetryEnabled              bool
	ProfilePictureEndpointURL     string
	ProfilePictureBucketName      string
	ProfilePictureAccessKeyID     string
	ProfilePictureSecretAccessKey string
}

type CronConfig struct {
	DatabaseURL                   string
	CronTimezone                  string
	Environment                   string
	ServiceName                   string
	TelemetryEnabled              bool
	ProfilePictureEndpointURL     string
	ProfilePictureBucketName      string
	ProfilePictureAccessKeyID     string
	ProfilePictureSecretAccessKey string
}

func Load() *Config {
	environment := getEnvOrDefault("ENVIRONMENT", "development")

	if environment == "development" {
		if err := cenv.VerifyEx("../../.env", "../../cenv.schema.json"); err != nil {
			log.Println(err)
		}
	}

	apiPort := toGoPort(getEnvOrDefault("UNO_API_PORT", "8000"))

	return &Config{
		// General configuration
		DatabaseURL:      os.Getenv("DATABASE_URL"),
		AdminAPIKey:      os.Getenv("ADMIN_KEY"),
		Environment:      environment,
		ServiceName:      getEnvOrDefault("SERVICE_NAME", "uno-api"),
		TelemetryEnabled: getEnvOrDefault("TELEMETRY_ENABLED", "false") == "true",
		OTLPEndpoint:     os.Getenv("OTEL_EXPORTER_OTLP_ENDPOINT"),

		// API configuration
		ApiPort: apiPort,

		// Profile picture configuration
		ProfilePictureEndpointURL:     os.Getenv("PROFILE_PICTURE_ENDPOINT_URL"),
		ProfilePictureBucketName:      getEnvOrDefault("PROFILE_PICTURE_BUCKET_NAME", "profile-pictures"),
		ProfilePictureAccessKeyID:     os.Getenv("PROFILE_PICTURE_ACCESS_KEY_ID"),
		ProfilePictureSecretAccessKey: os.Getenv("PROFILE_PICTURE_SECRET_ACCESS_KEY"),
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
		// General configuration
		DatabaseURL:      os.Getenv("DATABASE_URL"),
		Environment:      environment,
		ServiceName:      getEnvOrDefault("SERVICE_NAME", "uno-cron"),
		TelemetryEnabled: getEnvOrDefault("TELEMETRY_ENABLED", "false") == "true",

		// Cron configuration
		CronTimezone: getEnvOrDefault("CRON_TIMEZONE", "Europe/Oslo"),

		// Profile picture configuration
		ProfilePictureEndpointURL:     os.Getenv("PROFILE_PICTURE_ENDPOINT_URL"),
		ProfilePictureBucketName:      getEnvOrDefault("PROFILE_PICTURE_BUCKET_NAME", "profile-pictures"),
		ProfilePictureAccessKeyID:     os.Getenv("PROFILE_PICTURE_ACCESS_KEY_ID"),
		ProfilePictureSecretAccessKey: os.Getenv("PROFILE_PICTURE_SECRET_ACCESS_KEY"),
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
