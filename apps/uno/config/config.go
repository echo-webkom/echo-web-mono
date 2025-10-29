package config

import (
	"log"
	"os"

	"github.com/echo-webkom/cenv"
)

type Config struct {
	DatabaseURL string
	ApiPort     string
}

func Load() *Config {
	if err := cenv.Load(); err != nil {
		log.Fatal(err)
	}

	return &Config{
		DatabaseURL: os.Getenv("DATABASE_URL"),
		ApiPort:     os.Getenv("API_PORT"),
	}
}
