package service

import (
	"database/sql"
)

type ShoppingListService struct {
	db *sql.DB
}

func NewShoppingListService(db *sql.DB) *ShoppingListService {
	return &ShoppingListService{
		db: db,
	}
}

type ShoppingListItemWithUser struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	UserID   string `json:"userId"`
	UserName string `json:"userName"`
}

func (s *ShoppingListService) ListShoppingItems() ([]ShoppingListItemWithUser, error) {
	rows, err := s.db.Query(`
SELECT
    sli.id,
    sli.name AS item_name,
    sli.user_id,
    u.name AS user_name
FROM shopping_list_item sli
JOIN "user" u ON sli.user_id = u.id;
`)

	if err != nil {
		return nil, err
	}
	defer rows.Close()

	items := make([]ShoppingListItemWithUser, 0)
	for rows.Next() {
		var item ShoppingListItemWithUser
		if err := rows.Scan(&item.ID, &item.Name, &item.UserID, &item.UserName); err != nil {
			return nil, err
		}
		items = append(items, item)
	}

	return items, nil
}

type CreateShoppingItemRequest struct {
	Name   string `json:"name"`
	UserID string `json:"userId"`
}

func (s *ShoppingListService) CreateShoppingItem(name, userID string) (string, error) {
	var id string
	err := s.db.QueryRow(`
INSERT INTO shopping_list_item (name, user_id)
VALUES ($1, $2)
RETURNING id;
`, name, userID).Scan(&id)
	if err != nil {
		return "", err
	}

	s.LikeShoppingListItem(id, userID)

	return id, nil
}

func (s *ShoppingListService) LikeShoppingListItem(itemID, userID string) error {
	_, err := s.db.Exec(`
INSERT INTO users_to_shopping_list_items (user_id, item_id)
VALUES ($1, $2)
ON CONFLICT (user_id, item_id) DO NOTHING;
`, userID, itemID)

	return err
}
