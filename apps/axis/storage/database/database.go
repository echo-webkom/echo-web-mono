package database

import (
	"database/sql"

	_ "github.com/lib/pq"
)

func Connect() (*sql.DB, error) {
	connStr := "user=username password=password dbname=mydb host=localhost port=5432 sslmode=disable"
	return sql.Open("postgres", connStr)

}
