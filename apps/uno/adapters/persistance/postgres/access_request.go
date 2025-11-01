package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type AccessRequestRepo struct {
	db *Database
}

func (a *AccessRequestRepo) CreateAccessRequest(ctx context.Context, ar model.AccessRequest) error {
	query := `
		INSERT INTO access_requests (email, reason, created_at)
		VALUES ($1, $2, NOW())
	`
	_, err := a.db.ExecContext(ctx, query, ar.Email, ar.Reason)
	return err
}

func (a *AccessRequestRepo) GetAccessRequests(ctx context.Context) (ars []model.AccessRequest, err error) {
	query := `
		SELECT id, email, reason, created_at
		FROM access_requests
		ORDER BY created_at DESC
	`
	err = a.db.SelectContext(ctx, &ars, query)
	return ars, err

}

func NewAccessRequestRepo(db *Database) repo.AccessRequestRepo {
	return &AccessRequestRepo{db: db}
}
