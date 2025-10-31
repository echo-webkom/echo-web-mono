package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type PostgresUsersToShoppingListItemImpl struct {
	db *Database
}

func NewPostgresUsersToShoppingListItemImpl(db *Database) repo.UsersToShoppingListItemRepo {
	return &PostgresUsersToShoppingListItemImpl{db: db}
}

func (p *PostgresUsersToShoppingListItemImpl) GetAllUserToShoppingListItems(ctx context.Context) (ranges []model.UsersToShoppingListItems, err error) {
	query := `
	SELECT user_id, item_id, created_at FROM users_to_shopping_list_items
	`

	err = p.db.SelectContext(ctx, &ranges, query)
	return ranges, err
}

func (p *PostgresUsersToShoppingListItemImpl) AddUserToShoppingListItem(ctx context.Context, userItem model.UsersToShoppingListItems) error {
	query := `
	INSERT INTO users_to_shopping_list_items (user_id, item_id) VALUES ($1, $2)
	`
	_, err := p.db.ExecContext(ctx, query, userItem.UserID, userItem.ItemID)
	return err
}

func (p *PostgresUsersToShoppingListItemImpl) DeleteUserToShoppingListItem(ctx context.Context, userID string, itemID string) error {
	query := `
	DELETE FROM users_to_shopping_list_items WHERE user_id = $1 AND item_id = $2
	`
	_, err := p.db.ExecContext(ctx, query, userID, itemID)
	return err
}
