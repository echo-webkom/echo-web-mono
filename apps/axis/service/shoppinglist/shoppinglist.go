package shoppinglist

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type ShoppingListService struct {
	pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *ShoppingListService {
	return &ShoppingListService{
		pool,
	}
}

// List the shopping list items with their associated user information.
func (s *ShoppingListService) ListShoppingItems(ctx context.Context) ([]ShoppingListItemWithUser, error) {
	rows, err := s.pool.Query(ctx, `
		SELECT
    		sli.id,
    		sli.name AS item_name,
    		sli.user_id,
    		u.name AS user_name,
    		COALESCE(array_agg(l.user_id) FILTER (WHERE l.user_id IS NOT NULL), '{}') AS likes
		FROM shopping_list_item sli
		JOIN "user" u ON sli.user_id = u.id
		LEFT JOIN users_to_shopping_list_items l ON sli.id = l.item_id
		GROUP BY sli.id, u.name`)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := []ShoppingListItemWithUser{}
	for rows.Next() {
		var item ShoppingListItemWithUser
		var likes []string

		if err := rows.Scan(&item.ID, &item.Name, &item.UserID, &item.UserName, &likes); err != nil {
			return nil, err
		}

		item.Likes = likes
		items = append(items, item)
	}

	return items, nil
}

// Creates a new shopping list item.
func (s *ShoppingListService) CreateShoppingItem(ctx context.Context, name, userID string) (string, error) {
	var id string
	err := s.pool.QueryRow(ctx, `
		INSERT INTO shopping_list_item (name, user_id)
		VALUES ($1, $2)
		RETURNING id`, name, userID).Scan(&id)
	if err != nil {
		return "", err
	}

	s.LikeShoppingListItem(ctx, id, userID)

	return id, nil
}

// Likes a shopping list item for a user.
func (s *ShoppingListService) LikeShoppingListItem(ctx context.Context, itemID, userID string) error {
	_, err := s.pool.Exec(ctx, `
		INSERT INTO users_to_shopping_list_items (user_id, item_id)
		VALUES ($1, $2)
		ON CONFLICT (user_id, item_id) DO NOTHING`, userID, itemID)

	return err
}

// Removes a like from a shopping list item for a user.
func (s *ShoppingListService) UnlikeShoppingListItem(ctx context.Context, itemID, userID string) error {
	_, err := s.pool.Exec(ctx, `
		DELETE FROM users_to_shopping_list_items
		WHERE user_id = $1 AND item_id = $2`, userID, itemID)
	return err
}

// Checks if a user has liked a shopping list item.
func (s *ShoppingListService) HasUserLikedItem(ctx context.Context, userID, itemID string) (bool, error) {
	var liked bool
	err := s.pool.QueryRow(ctx, `
		SELECT EXISTS (
			SELECT 1
			FROM users_to_shopping_list_items
			WHERE user_id = $1 AND item_id = $2
		)`, userID, itemID).Scan(&liked)

	if err != nil {
		return false, err
	}

	return liked, nil
}
