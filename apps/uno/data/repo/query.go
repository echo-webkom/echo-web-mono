package repo

import (
	"context"
	"uno/data/model"
)

type Row interface {
	Scan(dest ...any) error
}

func scanHappening(row Row, hap *model.Happening) error {
	return row.Scan(
		&hap.ID,
		&hap.Slug,
		&hap.Title,
		&hap.Type,
		&hap.Date,
		&hap.RegistrationGroups,
		&hap.RegistrationStartGroups,
		&hap.RegistrationStart,
		&hap.RegistrationEnd,
	)
}

func (r *Repo) GetAllHappenings(ctx context.Context) (res []model.Happening, err error) {
	query := "SELECT * FROM happening"

	rows, err := r.pool.Query(ctx, query)
	if err != nil {
		return res, err
	}

	for rows.Next() {
		var hap model.Happening
		if err := scanHappening(rows, &hap); err != nil {
			return res, err
		}

		res = append(res, hap)
	}

	return res, err
}
