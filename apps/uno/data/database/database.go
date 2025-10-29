package database

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Database struct {
	Pool *pgxpool.Pool
}

func New(databaseUrl string) (*Database, error) {
	pool, err := pgxpool.New(context.Background(), databaseUrl)
	if err != nil {
		return nil, err
	}

	if err := pool.Ping(context.Background()); err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}

	if err := runMigrations(pool); err != nil {
		return nil, err
	}

	return &Database{Pool: pool}, nil
}

func runMigrations(pool *pgxpool.Pool) error {
	return nil
}
