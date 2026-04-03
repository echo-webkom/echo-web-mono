package config

import (
	"log"
	"os"
	"strings"

	"github.com/echo-webkom/cenv"
)

type Environment string

const (
	Testing     Environment = "testing"
	Development Environment = "development"
	Staging     Environment = "staging"
	Production  Environment = "production"
)

type Config struct {
	DatabaseURL string
	ApiPort     string
	AdminAPIKey string
	AuthSecret  string
	Environment Environment

	ProfilePictureEndpointURL     string
	ProfilePictureBucketName      string
	ProfilePictureAccessKeyID     string
	ProfilePictureSecretAccessKey string

	SanityProjectID  string
	SanityDataset    string
	SanityAPIToken   string
	SanityAPIVersion string

	RedisURL string
}

type CronConfig struct {
	DatabaseURL  string
	CronTimezone string
	Environment  Environment

	ProfilePictureEndpointURL     string
	ProfilePictureBucketName      string
	ProfilePictureAccessKeyID     string
	ProfilePictureSecretAccessKey string
}

func Load() *Config {
	environment := parseEnvironment(os.Getenv("ENVIRONMENT"))

	if environment == Development {
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

		// Redis cache configuration
		RedisURL: os.Getenv("REDIS_URL"),

		// Sanity CMS configuration
		SanityProjectID:  getEnvOrDefault("SANITY_PROJECT_ID", "pgq2pd26"),
		SanityDataset:    getEnvOrDefault("NEXT_PUBLIC_SANITY_DATASET", "production"),
		SanityAPIVersion: getEnvOrDefault("SANITY_API_VERSION", "2023-05-03"),
	}
}

func LoadCronConfig() *CronConfig {
	environment := parseEnvironment(os.Getenv("ENVIRONMENT"))

	if environment == Development {
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

// parseEnvironment determines the environment based on the prefix of the input string.
// Since all the environments start with different letters, we can use the first letter to determine the environment.
func parseEnvironment(env string) Environment {
	// Lowercase the input to make it case-insensitive
	env = strings.ToLower(env)

	if strings.HasPrefix(env, "t") {
		return Testing
	}
	if strings.HasPrefix(env, "s") {
		return Staging
	}
	if strings.HasPrefix(env, "d") {
		return Development
	}
	if strings.HasPrefix(env, "p") {
		return Production
	}
	// We default to production if the environment can not be determined, since this is the safest option.
	return Production
}
