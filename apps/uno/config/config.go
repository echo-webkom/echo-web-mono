package config

import (
	"log"
	"os"

	"github.com/echo-webkom/cenv"
)

type Config struct {
	DatabaseURL string
	ApiPort     string
	AdminAPIKey string
	AuthSecret  string
	Environment string

	ProfilePictureEndpointURL     string
	ProfilePictureBucketName      string
	ProfilePictureAccessKeyID     string
	ProfilePictureSecretAccessKey string

	SanityProjectID  string
	SanityDataset    string
	SanityAPIToken   string
	SanityAPIVersion string
}

type CronConfig struct {
	DatabaseURL  string
	CronTimezone string
	Environment  string

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
		DatabaseURL: os.Getenv("DATABASE_URL"),
		AdminAPIKey: os.Getenv("ADMIN_KEY"),
		AuthSecret:  os.Getenv("AUTH_SECRET"),
		Environment: environment,

		// API configuration
		ApiPort: apiPort,

		// Profile picture configuration
		ProfilePictureEndpointURL:     os.Getenv("PROFILE_PICTURE_ENDPOINT_URL"),
		ProfilePictureBucketName:      getEnvOrDefault("PROFILE_PICTURE_BUCKET_NAME", "profile-pictures"),
		ProfilePictureAccessKeyID:     os.Getenv("PROFILE_PICTURE_ACCESS_KEY_ID"),
		ProfilePictureSecretAccessKey: os.Getenv("PROFILE_PICTURE_SECRET_ACCESS_KEY"),

		// Sanity CMS configuration
		SanityProjectID:  getEnvOrDefault("SANITY_PROJECT_ID", "pgq2pd26"),
		SanityDataset:    getEnvOrDefault("SANITY_DATASET", "production"),
		SanityAPIToken:   os.Getenv("SANITY_API_TOKEN"),
		SanityAPIVersion: getEnvOrDefault("SANITY_API_VERSION", "2023-05-03"),
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
		DatabaseURL: os.Getenv("DATABASE_URL"),
		Environment: environment,

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
