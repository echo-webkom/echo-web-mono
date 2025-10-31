package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type PostgresShoppingListItemImpl struct {
	db *Database
}

func NewPostgresShoppingListItemImpl(db *Database) repo.ShoppingListItemRepo {
	return &PostgresShoppingListItemImpl{db: db}
}

func (p *PostgresShoppingListItemImpl) CreateShoppingListItem(ctx context.Context, item model.ShoppingListItem) error {
	query := `
	INSERT INTO shopping_list_item (id, user_id, name, created_at) VALUES ($1, $2, $3, $4)
	`
	_, err := p.db.ExecContext(ctx, query, item.ID, item.UserID, item.Name, item.CreatedAt)
	return err
}

func (p *PostgresShoppingListItemImpl) DeleteShoppingListItem(ctx context.Context, itemID string) error {
	query := `
	DELETE FROM shopping_list_item WHERE id = $1
	`
	_, err := p.db.ExecContext(ctx, query, itemID)
	return err
}

func (p *PostgresShoppingListItemImpl) GetAllShoppingListItems(ctx context.Context) ([]repo.ShoppingListItemWithCreator, error) {
	query := `
	SELECT
		sli.id, sli.user_id, sli.name, sli.created_at,
		u.name AS "user_name"
	FROM shopping_list_item sli
	JOIN "user" u ON sli.user_id = u.id
	`

	var items []repo.ShoppingListItemWithCreator
	err := p.db.SelectContext(ctx, &items, query)
	return items, err

}
