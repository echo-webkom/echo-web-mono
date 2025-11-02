package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type DegreeRepo struct {
	db *Database
}

func (p *DegreeRepo) GetAllDegrees(ctx context.Context) ([]model.Degree, error) {
	query := `--sql
		SELECT id, name
		FROM degree
	`
	res := []model.Degree{}
	err := p.db.SelectContext(ctx, &res, query)
	return res, err
}

func (p *DegreeRepo) CreateDegree(ctx context.Context, degree model.Degree) (model.Degree, error) {
	query := `--sql
		INSERT INTO degree (id, name)
		VALUES ($1, $2)
		RETURNING id, name
	`
	err := p.db.GetContext(ctx, &degree, query, degree.ID, degree.Name)
	return degree, err
}

func (p *DegreeRepo) UpdateDegree(ctx context.Context, degree model.Degree) (model.Degree, error) {
	query := `--sql
		UPDATE degree
		SET name = $2
		WHERE id = $1
		RETURNING id, name
	`
	err := p.db.GetContext(ctx, &degree, query, degree.ID, degree.Name)
	return degree, err
}

func (p *DegreeRepo) DeleteDegree(ctx context.Context, id string) error {
	query := `--sql
		DELETE FROM degree
		WHERE id = $1
	`
	_, err := p.db.ExecContext(ctx, query, id)
	return err
}

func NewDegreeRepo(db *Database) repo.DegreeRepo {
	return &DegreeRepo{db: db}
}
