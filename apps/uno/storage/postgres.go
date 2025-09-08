package storage

import (
	"context"

	"github.com/echo-webkom/uno/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Postgres struct {
	*gorm.DB
}

func NewPostgres(config *config.Config, ctx context.Context) *Postgres {
	gorm, err := gorm.Open(postgres.Open(config.DatabaseURL), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	return &Postgres{
		gorm,
	}
}
