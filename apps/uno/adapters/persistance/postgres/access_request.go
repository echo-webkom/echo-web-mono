package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type AccessRequestRepo struct {
	db *Database
}

func (a *AccessRequestRepo) CreateAccessRequest(ctx context.Context, ar model.AccessRequest) (model.AccessRequest, error) {
	query := `--sql
		INSERT INTO access_request (id, email, reason)
		VALUES (gen_random_uuid(), $1, $2)
		RETURNING id, email, reason, created_at
	`
	var result model.AccessRequest
	err := a.db.GetContext(ctx, &result, query, ar.Email, ar.Reason)
	return result, err
}

func (a *AccessRequestRepo) GetAccessRequests(ctx context.Context) (ars []model.AccessRequest, err error) {
	ars = []model.AccessRequest{}
	query := `--sql
		SELECT id, email, reason, created_at
		FROM access_request
		ORDER BY created_at DESC
	`
	err = a.db.SelectContext(ctx, &ars, query)
	return ars, err

}

func NewAccessRequestRepo(db *Database) repo.AccessRequestRepo {
	return &AccessRequestRepo{db: db}
}
