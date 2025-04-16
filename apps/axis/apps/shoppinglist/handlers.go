package shoppinglist

import (
	"net/http"

	"github.com/echo-webkom/axis/apputil"
	"github.com/echo-webkom/axis/service"
)

func ListShoppingItems(h *apputil.Handler) http.HandlerFunc {
	sls := service.NewShoppingListService(h.DB)

	return func(w http.ResponseWriter, r *http.Request) {
		items, err := sls.ListShoppingItems()
		if err != nil {
			h.Error(w, http.StatusInternalServerError, err)
			return
		}

		h.JSON(w, http.StatusOK, items)
	}
}

func CreateShoppingItem(h *apputil.Handler) http.HandlerFunc {
	sls := service.NewShoppingListService(h.DB)

	return func(w http.ResponseWriter, r *http.Request) {
		var item service.CreateShoppingItemRequest
		if err := h.Bind(r, &item); err != nil {
			h.Error(w, http.StatusBadRequest, err)
			return
		}

		id, err := sls.CreateShoppingItem(item.Name, item.UserID)
		if err != nil {
			h.Error(w, http.StatusInternalServerError, err)
			return
		}

		h.JSON(w, http.StatusCreated, map[string]string{
			"id": id,
		})
	}
}
