package api

import (
	"errors"
	"net/http"

	"github.com/echo-webkom/uno/apiutil"
	"github.com/echo-webkom/uno/service/shoppinglist"
	"github.com/go-chi/chi/v5"
)

func ShoppingListRouter(h *apiutil.Handler) *apiutil.Router {
	r := apiutil.NewRouter()
	sls := shoppinglist.New(h.Pool)

	// GET /shopping-list
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		items, err := sls.ListShoppingItems(ctx)
		if err != nil {
			h.Error(w, http.StatusInternalServerError, err)
			return
		}

		h.JSON(w, http.StatusOK, items)
	})

	// POST /shopping-list
	r.Post("/", func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		var item shoppinglist.CreateShoppingItemRequest
		if err := h.Bind(r, &item); err != nil {
			h.Error(w, http.StatusBadRequest, err)
			return
		}

		id, err := sls.CreateShoppingItem(ctx, item.Name, item.UserID)
		if err != nil {
			h.Error(w, http.StatusInternalServerError, err)
			return
		}

		h.JSON(w, http.StatusCreated, map[string]string{
			"id": id,
		})
	})

	// POST /shopping-list/:id/like
	r.Post("/{itemID}/like", func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()

		itemID := chi.URLParam(r, "itemID")
		if itemID == "" {
			h.Error(w, http.StatusBadRequest, errors.New("missing id"))
			return
		}

		hasLiked, err := sls.HasUserLikedItem(ctx, "foo", itemID)
		if err != nil {
			h.Error(w, http.StatusInternalServerError, errors.New("failed to check if user has liked item"))
			return
		}

		if hasLiked {
			err = sls.UnlikeShoppingListItem(ctx, itemID, "foo")
		} else {
			err = sls.LikeShoppingListItem(ctx, itemID, "foo")
		}

		if err != nil {
			h.Error(w, http.StatusInternalServerError, err)
			return
		}

		h.JSON(w, http.StatusOK, nil)
	})

	return r
}
