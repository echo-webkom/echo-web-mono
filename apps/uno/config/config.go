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
	// General configuration
	Environment Environment
	ApiPort     string

	// URL configuration
	UnoBaseURL  string
	WebBaseURL  string
	CatBaseURL  string
	VervBaseURL string

	// Authentication configuration
	AdminAPIKey string
	AuthSecret  string

	// Feide configuration
	FeideClientID     string
	FeideClientSecret string

	// Profile picture configuration
	ProfilePictureEndpointURL     string
	ProfilePictureBucketName      string
	ProfilePictureAccessKeyID     string
	ProfilePictureSecretAccessKey string

	// Sanity configuration
	SanityProjectID  string
	SanityDataset    string
	SanityAPIToken   string
	SanityAPIVersion string

	// Storage configuration
	DatabaseURL string
	RedisURL    string
}

type CronConfig struct {
	// Cron configuration
	Environment  Environment
	CronTimezone string

	// Sanity configuration
	SanityProjectID  string
	SanityDataset    string
	SanityAPIToken   string
	SanityAPIVersion string

	// Profile picture configuration
	ProfilePictureEndpointURL     string
	ProfilePictureBucketName      string
	ProfilePictureAccessKeyID     string
	ProfilePictureSecretAccessKey string

	// Storage configuration
	DatabaseURL string
	RedisURL    string
}

func Load() *Config {
	env := strings.ToLower(os.Getenv("ENVIRONMENT"))
	if strings.HasPrefix(env, "dev") {
		if err := cenv.VerifyEx("../../.env", "../../cenv.schema.json"); err != nil {
			log.Println(err)
		}
	}

	return &Config{
		Environment: parseEnvironment(os.Getenv("ENVIRONMENT")),
		ApiPort:     toGoPort(getEnvOrDefault("UNO_API_PORT", "8000")),

		UnoBaseURL:  getEnvOrDefault("NEXT_PUBLIC_API_URL", "http://localhost:8000"),
		WebBaseURL:  getEnvOrDefault("NEXT_PUBLIC_WEB_BASE_URL", "http://localhost:3000"),
		CatBaseURL:  getEnvOrDefault("PUBLIC_CAT_BASE_URL", "http://localhost:5173"),
		VervBaseURL: getEnvOrDefault("PUBLIC_VERV_BASE_URL", "http://localhost:3001"),

		AdminAPIKey: os.Getenv("ADMIN_KEY"),
		AuthSecret:  os.Getenv("AUTH_SECRET"),

		FeideClientID:     os.Getenv("FEIDE_CLIENT_ID"),
		FeideClientSecret: os.Getenv("FEIDE_CLIENT_SECRET"),

		ProfilePictureEndpointURL:     os.Getenv("PROFILE_PICTURE_ENDPOINT_URL"),
		ProfilePictureBucketName:      getEnvOrDefault("PROFILE_PICTURE_BUCKET_NAME", "profile-pictures"),
		ProfilePictureAccessKeyID:     os.Getenv("PROFILE_PICTURE_ACCESS_KEY_ID"),
		ProfilePictureSecretAccessKey: os.Getenv("PROFILE_PICTURE_SECRET_ACCESS_KEY"),

		SanityProjectID:  getEnvOrDefault("SANITY_PROJECT_ID", "pgq2pd26"),
		SanityDataset:    getEnvOrDefault("NEXT_PUBLIC_SANITY_DATASET", "production"),
		SanityAPIVersion: getEnvOrDefault("SANITY_API_VERSION", "2023-05-03"),
		SanityAPIToken:   os.Getenv("SANITY_API_TOKEN"),

		DatabaseURL: os.Getenv("DATABASE_URL"),
		RedisURL:    os.Getenv("REDIS_URL"),
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
		Environment: environment,

		CronTimezone: "Europe/Oslo",

		SanityProjectID:  getEnvOrDefault("SANITY_PROJECT_ID", "pgq2pd26"),
		SanityDataset:    getEnvOrDefault("NEXT_PUBLIC_SANITY_DATASET", "production"),
		SanityAPIVersion: getEnvOrDefault("SANITY_API_VERSION", "2023-05-03"),
		SanityAPIToken:   os.Getenv("SANITY_API_TOKEN"),

		ProfilePictureEndpointURL:     os.Getenv("PROFILE_PICTURE_ENDPOINT_URL"),
		ProfilePictureBucketName:      getEnvOrDefault("PROFILE_PICTURE_BUCKET_NAME", "profile-pictures"),
		ProfilePictureAccessKeyID:     os.Getenv("PROFILE_PICTURE_ACCESS_KEY_ID"),
		ProfilePictureSecretAccessKey: os.Getenv("PROFILE_PICTURE_SECRET_ACCESS_KEY"),

		DatabaseURL: os.Getenv("DATABASE_URL"),
		RedisURL:    os.Getenv("REDIS_URL"),
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
