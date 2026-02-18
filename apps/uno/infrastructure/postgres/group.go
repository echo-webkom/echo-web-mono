package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
	"uno/pkg/unsafeid"
)

type GroupRepo struct {
	db     *Database
	logger port.Logger
}

func NewGroupRepo(db *Database, logger port.Logger) port.GroupRepo {
	return &GroupRepo{
		db:     db,
		logger: logger,
	}
}

// GetGroupByID retrieves a group by its ID from the database.
func (g *GroupRepo) GetGroupByID(ctx context.Context, id string) (model.Group, error) {
	g.logger.Info(ctx, "fetching group by ID",
		"id", id,
	)

	query := `--sql
		SELECT id, name
		FROM "group"
		WHERE id = $1
	`
	var dbModel record.GroupDB
	err := g.db.GetContext(ctx, &dbModel, query, id)
	if err != nil {
		g.logger.Error(ctx, "failed to fetch group by ID",
			"error", err,
			"id", id,
		)
		return model.Group{}, err
	}
	return *dbModel.ToDomain(), nil
}

// CreateGroup creates a new group in the database.
func (g *GroupRepo) CreateGroup(ctx context.Context, group model.NewGroup) (model.Group, error) {
	g.logger.Info(ctx, "creating group",
		"name", group.Name,
	)

	// Generate an ID if not provided
	var err error
	var id string
	if group.ID != nil {
		id = *group.ID
	} else {
		id, err = unsafeid.Generate(21)
		if err != nil {
			return model.Group{}, err
		}
	}

	query := `--sql
		INSERT INTO "group" (id, name)
		VALUES ($1, $2)
		RETURNING id, name
	`
	var dbModel record.GroupDB
	err = g.db.GetContext(ctx, &dbModel, query, id, group.Name)
	if err != nil {
		g.logger.Error(ctx, "failed to create group",
			"error", err,
			"name", group.Name,
		)
		return model.Group{}, err
	}
	return *dbModel.ToDomain(), nil
}

// DeleteGroup deletes a group by its ID from the database.
func (g *GroupRepo) DeleteGroup(ctx context.Context, id string) error {
	g.logger.Info(ctx, "deleting group",
		"id", id,
	)

	query := `--sql
		DELETE FROM "group"
		WHERE id = $1
	`
	if _, err := g.db.ExecContext(ctx, query, id); err != nil {
		g.logger.Error(ctx, "failed to delete group",
			"error", err,
			"id", id,
		)
		return err
	}
	return nil
}

// UpdateGroup updates an existing group in the database.
func (g *GroupRepo) UpdateGroup(ctx context.Context, group model.Group) (model.Group, error) {
	g.logger.Info(ctx, "updating group",
		"id", group.ID,
		"name", group.Name,
	)

	query := `--sql
		UPDATE "group"
		SET name = $2
		WHERE id = $1
		RETURNING id, name
	`
	var dbModel record.GroupDB
	err := g.db.GetContext(ctx, &dbModel, query, group.ID, group.Name)
	if err != nil {
		g.logger.Error(ctx, "failed to update group",
			"error", err,
			"id", group.ID,
			"name", group.Name,
		)
		return model.Group{}, err
	}
	return *dbModel.ToDomain(), nil
}
