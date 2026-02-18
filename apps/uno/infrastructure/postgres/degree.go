package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
)

type DegreeRepo struct {
	db     *Database
	logger port.Logger
}

func NewDegreeRepo(db *Database, logger port.Logger) port.DegreeRepo {
	return &DegreeRepo{db: db, logger: logger}
}

func (p *DegreeRepo) GetAllDegrees(ctx context.Context) ([]model.Degree, error) {
	p.logger.Info(ctx, "getting all degrees")

	query := `--sql
		SELECT id, name
		FROM degree
	`
	var degreesDB []record.DegreeDB
	err := p.db.SelectContext(ctx, &degreesDB, query)
	if err != nil {
		p.logger.Error(ctx, "failed to get all degrees",
			"error", err,
		)
		return []model.Degree{}, err
	}
	return record.DegreeToDomainList(degreesDB), nil
}

func (p *DegreeRepo) CreateDegree(ctx context.Context, degree model.Degree) (model.Degree, error) {
	p.logger.Info(ctx, "creating degree",
		"id", degree.ID,
		"name", degree.Name,
	)

	query := `--sql
		INSERT INTO degree (id, name)
		VALUES ($1, $2)
		RETURNING id, name
	`
	var degreeDB record.DegreeDB
	err := p.db.GetContext(ctx, &degreeDB, query, degree.ID, degree.Name)
	if err != nil {
		p.logger.Error(ctx, "failed to create degree",
			"error", err,
			"id", degree.ID,
			"name", degree.Name,
		)
		return model.Degree{}, err
	}
	return *degreeDB.ToDomain(), nil
}

func (p *DegreeRepo) UpdateDegree(ctx context.Context, degree model.Degree) (model.Degree, error) {
	p.logger.Info(ctx, "updating degree",
		"id", degree.ID,
		"name", degree.Name,
	)

	query := `--sql
		UPDATE degree
		SET name = $2
		WHERE id = $1
		RETURNING id, name
	`
	var degreeDB record.DegreeDB
	err := p.db.GetContext(ctx, &degreeDB, query, degree.ID, degree.Name)
	if err != nil {
		p.logger.Error(ctx, "failed to update degree",
			"error", err,
			"id", degree.ID,
			"name", degree.Name,
		)
		return model.Degree{}, err
	}
	return *degreeDB.ToDomain(), nil
}

func (p *DegreeRepo) DeleteDegree(ctx context.Context, id string) error {
	p.logger.Info(ctx, "deleting degree",
		"id", id,
	)

	query := `--sql
		DELETE FROM degree
		WHERE id = $1
	`
	if _, err := p.db.ExecContext(ctx, query, id); err != nil {
		p.logger.Error(ctx, "failed to delete degree",
			"error", err,
			"id", id,
		)
		return err
	}

	return nil
}
