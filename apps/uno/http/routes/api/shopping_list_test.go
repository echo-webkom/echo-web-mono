package api_test

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/domain/model"
	"uno/domain/port"
	"uno/domain/port/mocks"
	"uno/domain/service"
	"uno/http/handler"
	"uno/http/routes/api"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestGetShoppingList(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.ShoppingListItemRepo, *mocks.UsersToShoppingListItemRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name: "success",
			setupMocks: func(mockShoppingListRepo *mocks.ShoppingListItemRepo, mockUsersToShoppingListRepo *mocks.UsersToShoppingListItemRepo) {
				items := []port.ShoppingListItemWithCreator{}
				mockShoppingListRepo.EXPECT().
					GetAllShoppingListItems(mock.Anything).
					Return(items, nil).
					Once()
				userLikes := []model.UsersToShoppingListItems{}
				mockUsersToShoppingListRepo.EXPECT().
					GetAllUserToShoppingListItems(mock.Anything).
					Return(userLikes, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name: "error from shopping list repo",
			setupMocks: func(mockShoppingListRepo *mocks.ShoppingListItemRepo, mockUsersToShoppingListRepo *mocks.UsersToShoppingListItemRepo) {
				mockShoppingListRepo.EXPECT().
					GetAllShoppingListItems(mock.Anything).
					Return([]port.ShoppingListItemWithCreator{}, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
		{
			name: "error from users to shopping list repo",
			setupMocks: func(mockShoppingListRepo *mocks.ShoppingListItemRepo, mockUsersToShoppingListRepo *mocks.UsersToShoppingListItemRepo) {
				items := []port.ShoppingListItemWithCreator{}
				mockShoppingListRepo.EXPECT().
					GetAllShoppingListItems(mock.Anything).
					Return(items, nil).
					Once()
				mockUsersToShoppingListRepo.EXPECT().
					GetAllUserToShoppingListItems(mock.Anything).
					Return([]model.UsersToShoppingListItems{}, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockShoppingListRepo := mocks.NewShoppingListItemRepo(t)
			mockUsersToShoppingListRepo := mocks.NewUsersToShoppingListItemRepo(t)

			tt.setupMocks(mockShoppingListRepo, mockUsersToShoppingListRepo)

			shoppingListService := service.NewShoppingListService(
				mockShoppingListRepo,
				mockUsersToShoppingListRepo,
			)

			r := httptest.NewRequest(http.MethodGet, "/shopping", nil)
			w := httptest.NewRecorder()

			h := api.GetShoppingList(testutil.NewTestLogger(), shoppingListService)
			ctx := handler.NewContext(w, r)
			err := h(ctx)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
			assert.Equal(t, tt.expectedStatus, ctx.Status())
		})
	}
}
