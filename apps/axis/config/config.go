package config

import (
	"log"
	"os"
)

type Config struct {
	Port      string
	AdminKey  string
	DBConnStr string
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

	return &Config{
		Port:      port,
		AdminKey:  adminKey,
		DBConnStr: "postgres://postgres:postgres@localhost:5432/echo-web?sslmode=disable",
	}
}
