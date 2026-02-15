package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
)

type ShoppingListRepo struct {
	db     *Database
	logger port.Logger
}

func NewShoppingListRepo(db *Database, logger port.Logger) port.ShoppingListItemRepo {
	return &ShoppingListRepo{db: db, logger: logger}
}

func (p *ShoppingListRepo) CreateShoppingListItem(ctx context.Context, item model.NewShoppingListItem) (model.ShoppingListItem, error) {
	p.logger.Info(ctx, "creating shopping list item",
		"user_id", item.UserID,
		"name", item.Name,
	)

	query := `--sql
		INSERT INTO shopping_list_item (id, user_id, name)
		VALUES (gen_random_uuid(), $1, $2)
		RETURNING id, user_id, name, created_at
	`
	var dbModel record.ShoppingListItemDB
	err := p.db.GetContext(ctx, &dbModel, query, item.UserID, item.Name)
	if err != nil {
		p.logger.Error(ctx, "failed to create shopping list item",
			"error", err,
			"user_id", item.UserID,
			"name", item.Name,
		)
		return model.ShoppingListItem{}, err
	}
	return *dbModel.ToDomain(), nil
}

func (p *ShoppingListRepo) DeleteShoppingListItem(ctx context.Context, itemID string) error {
	p.logger.Info(ctx, "deleting shopping list item",
		"item_id", itemID,
	)

	query := `--sql
		DELETE FROM shopping_list_item WHERE id = $1
	`
	_, err := p.db.ExecContext(ctx, query, itemID)
	if err != nil {
		p.logger.Error(ctx, "failed to delete shopping list item",
			"error", err,
			"item_id", itemID,
		)
		return err
	}
	return nil
}

func (p *ShoppingListRepo) GetAllShoppingListItems(ctx context.Context) ([]port.ShoppingListItemWithCreator, error) {
	p.logger.Info(ctx, "getting all shopping list items")

	query := `--sql
		SELECT
			sli.id, sli.user_id, sli.name, sli.created_at,
			u.name AS "user_name"
		FROM shopping_list_item sli
		JOIN "user" u ON sli.user_id = u.id
	`

	var dbModels []record.ShoppingListItemWithCreatorDB
	err := p.db.SelectContext(ctx, &dbModels, query)
	if err != nil {
		p.logger.Error(ctx, "failed to get all shopping list items",
			"error", err,
		)
		return nil, err
	}

	// Convert to domain models
	result := make([]port.ShoppingListItemWithCreator, len(dbModels))
	for i, dbModel := range dbModels {
		result[i] = *dbModel.ToDomain()
	}

	return result, nil
}
