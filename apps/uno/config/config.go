package config

import (
	"log"
	"os"
)

type Config struct {
	Port            string
	AdminKey        string
	DatabaseURL     string
	SanityProjectID string
	SanityDataset   string
}

func Load() *Config {
	port := os.Getenv("UNO_PORT")
	if port == "" {
		port = "8080"
	}

	adminKey := os.Getenv("ADMIN_KEY")
	if adminKey == "" {
		log.Fatal("ADMIN_KEY not set")
	}

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatalln("DATABASE_NOT not set")
	}

	sanityProjectID := os.Getenv("PUBLIC_SANITY_PROJECT_ID")
	if sanityProjectID == "" {
		log.Fatalln("PUBLIC_SANITY_PROJECT_ID not set")
	}

	sanityDataset := os.Getenv("PUBLIC_SANITY_DATASET")
	if sanityDataset == "" {
		log.Fatalln("PUBLIC_SANITY_DATASET not set")
	}

	return &Config{
		Port:            port,
		AdminKey:        adminKey,
		DatabaseURL:     databaseURL,
		SanityProjectID: sanityProjectID,
		SanityDataset:   sanityDataset,
	}
}
