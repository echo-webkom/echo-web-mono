package postgres

import (
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

type Database struct {
	*sqlx.DB
}

func New(databaseUrl string) (*Database, error) {
	db, err := sqlx.Open("postgres", databaseUrl)
	db.SetMaxOpenConns(10)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return &Database{db}, nil
}
