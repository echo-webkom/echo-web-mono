package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
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

// CreateGroup creates a new group in the database.
func (g *GroupRepo) CreateGroup(ctx context.Context, group model.NewGroup) (model.Group, error) {
	g.logger.Info(ctx, "creating group",
		"name", group.Name,
	)

	query := `--sql
		INSERT INTO "group" (id, name)
		VALUES (COALESCE($1, gen_random_uuid()), $2)
		RETURNING id, name
	`
	var dbModel record.GroupDB
	err := g.db.GetContext(ctx, &dbModel, query, group.ID, group.Name)
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
