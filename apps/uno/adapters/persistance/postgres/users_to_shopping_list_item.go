package postgres

// TODO: This could maybe be merged with the shopping list item repo?

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type UsersToShoppingListItemRepo struct {
	db *Database
}

func (p *UsersToShoppingListItemRepo) GetAllUserToShoppingListItems(ctx context.Context) (ranges []model.UsersToShoppingListItems, err error) {
	query := `--sql
		SELECT user_id, item_id, created_at FROM users_to_shopping_list_items
	`

	err = p.db.SelectContext(ctx, &ranges, query)
	return ranges, err
}

func (p *UsersToShoppingListItemRepo) AddUserToShoppingListItem(ctx context.Context, userID string, itemID string) error {
	query := `--sql
		INSERT INTO users_to_shopping_list_items (user_id, item_id) VALUES ($1, $2)
	`
	_, err := p.db.ExecContext(ctx, query, userID, itemID)
	return err
}

func (p *UsersToShoppingListItemRepo) DeleteUserToShoppingListItem(ctx context.Context, userID string, itemID string) error {
	query := `--sql
		DELETE FROM users_to_shopping_list_items WHERE user_id = $1 AND item_id = $2
	`
	_, err := p.db.ExecContext(ctx, query, userID, itemID)
	return err
}

func NewUsersToShoppingListItemRepo(db *Database) repo.UsersToShoppingListItemRepo {
	return &UsersToShoppingListItemRepo{db: db}
}
