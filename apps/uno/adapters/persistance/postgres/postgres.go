package postgres

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type Database struct {
	*sqlx.DB
}

func New(databaseUrl string) (*Database, error) {
	databaseUrl += "?sslmode=disable"
	db, err := sqlx.Connect("postgres", databaseUrl)
	if err != nil {
		return nil, err
	}

	return &Database{db}, nil
}
