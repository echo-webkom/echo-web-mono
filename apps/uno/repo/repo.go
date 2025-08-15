package repo

import (
	"context"

	"github.com/echo-webkom/uno/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

type Repo struct {
	db  *gorm.DB
	ctx context.Context
}

func NewRepo(config *config.Config, ctx context.Context) *Repo {
	db, err := gorm.Open(postgres.Open(config.DatabaseURL), &gorm.Config{})
	if err != nil {
		panic("failed to connect database")
	}

	// Migrate the schema
	// db.AutoMigrate(&happening.Happening{})

	return &Repo{
		db, ctx,
	}
}
