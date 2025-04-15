package database

import (
	"database/sql"
)

func GetHappeningById(db *sql.DB, id string) (*Happening, error) {
	row := db.QueryRow("SELECT id, title FROM happening WHERE id = ?", id)

	var evt Happening
	if err := row.Scan(&evt.ID, &evt.Title); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &evt, nil
}

func GetAllHappenings(db *sql.DB) ([]Happening, error) {
	rows, err := db.Query("SELECT id, title FROM happening")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	happenings := make([]Happening, 0)
	for rows.Next() {
		var evt Happening
		if err := rows.Scan(&evt.ID, &evt.Title); err != nil {
			return nil, err
		}
		happenings = append(happenings, evt)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return happenings, nil
}
