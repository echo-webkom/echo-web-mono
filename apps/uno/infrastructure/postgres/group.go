package postgres

import (
	"context"
	"database/sql"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
	"uno/pkg/randid"
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

// GetAllGroups retrieves all groups from the database.
func (g *GroupRepo) GetAllGroups(ctx context.Context) ([]model.Group, error) {
	g.logger.Info(ctx, "fetching all groups")

	query := `--sql
		SELECT id, name
		FROM "group"
		ORDER BY name ASC
	`
	var dbModels []record.GroupDB
	err := g.db.SelectContext(ctx, &dbModels, query)
	if err != nil {
		g.logger.Error(ctx, "failed to fetch all groups",
			"error", err,
		)
		return nil, err
	}

	groups := make([]model.Group, len(dbModels))
	for i, dbModel := range dbModels {
		groups[i] = *dbModel.ToDomain()
	}
	return groups, nil
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

// GetGroupMembers retrieves all members of a group by group ID.
func (g *GroupRepo) GetGroupMembers(ctx context.Context, groupID string) ([]model.GroupMember, error) {
	g.logger.Info(ctx, "getting group members",
		"group_id", groupID,
	)

	query := `--sql
		SELECT u.id, u.name, u.email, utg.is_leader
		FROM "users_to_groups" utg
		JOIN "user" u ON u.id = utg.user_id
		WHERE utg.group_id = $1
		ORDER BY utg.is_leader DESC, u.name ASC
	`

	type memberRow struct {
		ID       string  `db:"id"`
		Name     *string `db:"name"`
		Email    string  `db:"email"`
		IsLeader bool    `db:"is_leader"`
	}

	var rows []memberRow
	if err := g.db.SelectContext(ctx, &rows, query, groupID); err != nil {
		g.logger.Error(ctx, "failed to fetch group members",
			"error", err,
			"group_id", groupID,
		)
		return nil, err
	}

	members := make([]model.GroupMember, len(rows))
	for i, row := range rows {
		members[i] = model.GroupMember{
			ID:       row.ID,
			Name:     row.Name,
			Email:    row.Email,
			IsLeader: row.IsLeader,
		}
	}
	return members, nil
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
		id, err = randid.Generate(21)
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

func (g *GroupRepo) GetUserGroupMembership(ctx context.Context, groupID string, userID string) (*model.UsersToGroups, error) {
	g.logger.Info(ctx, "getting user group membership",
		"group_id", groupID,
		"user_id", userID,
	)

	query := `--sql
		SELECT user_id, group_id, is_leader
		FROM users_to_groups
		WHERE group_id = $1 AND user_id = $2
	`

	var dbModel record.UsersToGroupsDB
	if err := g.db.GetContext(ctx, &dbModel, query, groupID, userID); err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		g.logger.Error(ctx, "failed to get user group membership",
			"error", err,
			"group_id", groupID,
			"user_id", userID,
		)
		return nil, err
	}

	return dbModel.ToDomain(), nil
}

func (g *GroupRepo) SetGroupMemberLeader(ctx context.Context, groupID string, userID string, isLeader bool) error {
	g.logger.Info(ctx, "setting group member leader",
		"group_id", groupID,
		"user_id", userID,
		"is_leader", isLeader,
	)

	query := `--sql
		UPDATE users_to_groups
		SET is_leader = $3
		WHERE group_id = $1 AND user_id = $2
	`

	if _, err := g.db.ExecContext(ctx, query, groupID, userID, isLeader); err != nil {
		g.logger.Error(ctx, "failed to set group member leader",
			"error", err,
			"group_id", groupID,
			"user_id", userID,
		)
		return err
	}

	return nil
}

func (g *GroupRepo) AddUserToGroup(ctx context.Context, groupID string, userID string) error {
	g.logger.Info(ctx, "adding user to group",
		"group_id", groupID,
		"user_id", userID,
	)

	query := `--sql
		INSERT INTO users_to_groups (user_id, group_id)
		VALUES ($1, $2)
	`

	if _, err := g.db.ExecContext(ctx, query, userID, groupID); err != nil {
		g.logger.Error(ctx, "failed to add user to group",
			"error", err,
			"group_id", groupID,
			"user_id", userID,
		)
		return err
	}

	return nil
}

func (g *GroupRepo) RemoveUserFromGroup(ctx context.Context, groupID string, userID string) error {
	g.logger.Info(ctx, "removing user from group",
		"group_id", groupID,
		"user_id", userID,
	)

	query := `--sql
		DELETE FROM users_to_groups
		WHERE user_id = $1 AND group_id = $2
	`

	if _, err := g.db.ExecContext(ctx, query, userID, groupID); err != nil {
		g.logger.Error(ctx, "failed to remove user from group",
			"error", err,
			"group_id", groupID,
			"user_id", userID,
		)
		return err
	}

	return nil
}
