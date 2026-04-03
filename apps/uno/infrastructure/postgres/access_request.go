package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
)

type AccessRequestRepo struct {
	db     *Database
	logger port.Logger
}

func NewAccessRequestRepo(db *Database, logger port.Logger) port.AccessRequestRepo {
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
	var dbModel record.AccessRequestDB
	err := a.db.GetContext(ctx, &dbModel, query, ar.Email, ar.Reason)
	if err != nil {
		a.logger.Error(ctx, "failed to create access request",
			"error", err,
			"email", ar.Email,
		)
		return model.AccessRequest{}, err
	}
	return dbModel.ToDomain(), nil
}

func (a *AccessRequestRepo) GetAccessRequests(ctx context.Context) (ars []model.AccessRequest, err error) {
	a.logger.Info(ctx, "getting access requests")

	var dbModels []record.AccessRequestDB
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

	return record.ToDomainList(dbModels), nil
}

func (a *AccessRequestRepo) GetAccessRequestByID(ctx context.Context, id string) (model.AccessRequest, error) {
	a.logger.Info(ctx, "getting access request by id",
		"id", id,
	)

	query := `--sql
		SELECT id, email, reason, created_at
		FROM access_request
		WHERE id = $1
	`

	var dbModel record.AccessRequestDB
	if err := a.db.GetContext(ctx, &dbModel, query, id); err != nil {
		a.logger.Error(ctx, "failed to get access request by id",
			"error", err,
			"id", id,
		)
		return model.AccessRequest{}, err
	}

	return dbModel.ToDomain(), nil
}

func (a *AccessRequestRepo) DeleteAccessRequestByID(ctx context.Context, id string) error {
	a.logger.Info(ctx, "deleting access request by id",
		"id", id,
	)

	query := `--sql
		DELETE FROM access_request
		WHERE id = $1
	`

	if _, err := a.db.ExecContext(ctx, query, id); err != nil {
		a.logger.Error(ctx, "failed to delete access request by id",
			"error", err,
			"id", id,
		)
		return err
	}

	return nil
}
