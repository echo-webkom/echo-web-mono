package database

import (
	"database/sql"
	"fmt"

	"github.com/pressly/goose"
)

type Database struct {
	Pool *sql.DB
}

func New(databaseUrl string) (*Database, error) {
	db, err := sql.Open("sqlite3", databaseUrl)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	if err := runMigrations(db); err != nil {
		return nil, err
	}

	return &Database{Pool: db}, nil
}

func runMigrations(db *sql.DB) error {
	if err := goose.SetDialect("sqlite3"); err != nil {
		return fmt.Errorf("failed to set goose dialect: %w", err)
	}

	if err := goose.Up(db, "./migrations"); err != nil {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	return nil
}
