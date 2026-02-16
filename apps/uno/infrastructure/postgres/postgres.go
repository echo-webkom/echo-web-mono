package postgres

import (
	"strings"

	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
	"github.com/uptrace/opentelemetry-go-extra/otelsqlx"
)

type Database struct {
	*sqlx.DB
}

func New(databaseUrl string) (*Database, error) {
	if !strings.Contains(databaseUrl, "?sslmode=disable") {
		databaseUrl += "?sslmode=disable"
	}

	db, err := otelsqlx.Open("postgres", databaseUrl)
	db.SetMaxOpenConns(10)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return &Database{db}, nil
}
