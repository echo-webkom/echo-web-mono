package postgres

// TODO: This could maybe be merged with the shopping list item repo?

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
)

type UsersToShoppingListItemRepo struct {
	db     *Database
	logger port.Logger
}

func NewUsersToShoppingListItemRepo(db *Database, logger port.Logger) port.UsersToShoppingListItemRepo {
	return &UsersToShoppingListItemRepo{db: db, logger: logger}
}

func (p *UsersToShoppingListItemRepo) GetAllUserToShoppingListItems(ctx context.Context) ([]model.UsersToShoppingListItems, error) {
	p.logger.Info(ctx, "getting all users to shopping list items")

	var dbModels []record.UsersToShoppingListItemsDB
	query := `--sql
		SELECT user_id, item_id, created_at FROM users_to_shopping_list_items
	`

	err := p.db.SelectContext(ctx, &dbModels, query)
	if err != nil {
		p.logger.Error(ctx, "failed to get all users to shopping list items",
			"error", err,
		)
		return nil, err
	}

	// Convert to domain models
	result := make([]model.UsersToShoppingListItems, len(dbModels))
	for i, dbModel := range dbModels {
		result[i] = *dbModel.ToDomain()
	}

	return result, nil
}

// GetUserToShoppingListItem retrieves a specific user to shopping list item relationship by user ID and item ID.
func (p *UsersToShoppingListItemRepo) GetUserToShoppingListItem(ctx context.Context, userID string, itemID string) (*model.UsersToShoppingListItems, error) {
	p.logger.Info(ctx, "getting user to shopping list item",
		"user_id", userID,
		"item_id", itemID,
	)

	var dbModel record.UsersToShoppingListItemsDB
	query := `--sql
		SELECT user_id, item_id, created_at FROM users_to_shopping_list_items WHERE user_id = $1 AND item_id = $2
	`
	err := p.db.GetContext(ctx, &dbModel, query, userID, itemID)
	if err != nil {
		p.logger.Error(ctx, "failed to get user to shopping list item",
			"error", err,
			"user_id", userID,
			"item_id", itemID,
		)
		return nil, err
	}

	domainModel := dbModel.ToDomain()
	return domainModel, nil
}

// AddUserToShoppingListItem adds a user to a shopping list item, indicating that the user likes the item.
func (p *UsersToShoppingListItemRepo) AddUserToShoppingListItem(ctx context.Context, userID string, itemID string) error {
	p.logger.Info(ctx, "adding user to shopping list item",
		"user_id", userID,
		"item_id", itemID,
	)

	query := `--sql
		INSERT INTO users_to_shopping_list_items (user_id, item_id) VALUES ($1, $2)
	`
	if _, err := p.db.ExecContext(ctx, query, userID, itemID); err != nil {
		p.logger.Error(ctx, "failed to add user to shopping list item",
			"error", err,
			"user_id", userID,
			"item_id", itemID,
		)
		return err
	}
	return nil
}

// DeleteUserToShoppingListItem removes a user from a shopping list item, indicating that the user no longer likes the item.
func (p *UsersToShoppingListItemRepo) DeleteUserToShoppingListItem(ctx context.Context, userID string, itemID string) error {
	p.logger.Info(ctx, "deleting user to shopping list item",
		"user_id", userID,
		"item_id", itemID,
	)

	query := `--sql
		DELETE FROM users_to_shopping_list_items WHERE user_id = $1 AND item_id = $2
	`
	if _, err := p.db.ExecContext(ctx, query, userID, itemID); err != nil {
		p.logger.Error(ctx, "failed to delete user to shopping list item",
			"error", err,
			"user_id", userID,
			"item_id", itemID,
		)
		return err
	}

	return nil
}
