package repo

import "github.com/jmoiron/sqlx"

type Repo struct {
	db *sqlx.DB
}

func New(db *sqlx.DB) *Repo {
	return &Repo{db}
}
