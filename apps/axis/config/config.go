package config

import (
	"log"
	"os"
)

type Config struct {
	Port        string
	AdminKey    string
	DatabaseURL string
}

func Load() *Config {
	port := os.Getenv("AXIS_PORT")
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

	return &Config{
		Port:        port,
		AdminKey:    adminKey,
		DatabaseURL: databaseURL,
	}
}
