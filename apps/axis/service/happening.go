package service

import (
	"database/sql"

	"github.com/echo-webkom/axis/storage/database"
)

type HappeningService struct {
	db *sql.DB
}

func NewHappeningService(db *sql.DB) *HappeningService {
	return &HappeningService{db: db}
}

func (hs *HappeningService) GetHappeningById(id string) (*database.Happening, error) {
	row := hs.db.QueryRow(`
SELECT id, title FROM happening WHERE id = ?
`, id)

	var evt database.Happening
	if err := row.Scan(&evt.ID, &evt.Title); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &evt, nil
}

func (hs *HappeningService) GetAllHappenings() ([]database.Happening, error) {
	rows, err := hs.db.Query(`
SELECT id, title FROM happening
`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	happenings := make([]database.Happening, 0)
	for rows.Next() {
		var evt database.Happening
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
