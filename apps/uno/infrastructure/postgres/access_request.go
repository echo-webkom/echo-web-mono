package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/ports"
	"uno/infrastructure/postgres/models"
)

type AccessRequestRepo struct {
	db     *Database
	logger ports.Logger
}

func NewAccessRequestRepo(db *Database, logger ports.Logger) ports.AccessRequestRepo {
	return &AccessRequestRepo{db: db, logger: logger}
}

func (a *AccessRequestRepo) CreateAccessRequest(ctx context.Context, ar model.NewAccessRequest) (model.AccessRequest, error) {
	a.logger.Info(ctx, "creating access request",
		"email", ar.Email,
	)

	query := `--sql
		INSERT INTO access_request (id, email, reason)
		VALUES (gen_random_uuid(), $1, $2)
		RETURNING id, email, reason, created_at
	`
	var dbModel models.AccessRequestDB
	err := a.db.GetContext(ctx, &dbModel, query, ar.Email, ar.Reason)
	if err != nil {
		a.logger.Error(ctx, "failed to create access request",
			"error", err,
			"email", ar.Email,
		)
		return model.AccessRequest{}, err
	}
	return *dbModel.ToDomain(), nil
}

func (a *AccessRequestRepo) GetAccessRequests(ctx context.Context) (ars []model.AccessRequest, err error) {
	a.logger.Info(ctx, "getting access requests")

	var dbModels []models.AccessRequestDB
	query := `--sql
		SELECT id, email, reason, created_at
		FROM access_request
		ORDER BY created_at DESC
	`
	err = a.db.SelectContext(ctx, &dbModels, query)
	if err != nil {
		a.logger.Error(ctx, "failed to get access requests",
			"error", err,
		)
		return nil, err
	}

	return models.ToDomainList(dbModels), nil

}
