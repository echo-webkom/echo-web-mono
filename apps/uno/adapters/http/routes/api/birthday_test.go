package api_test

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/adapters/http/routes/api"
	"uno/domain/model"
	"uno/domain/ports/mocks"
	"uno/domain/service"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestBirthdaysTodayHandler(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.UserRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name: "success",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				users := []model.User{
					testutil.NewFakeStruct[model.User](func(u *model.User) {
						name := "John Doe"
						u.Name = &name
					}),
					testutil.NewFakeStruct[model.User](func(u *model.User) {
						name := "Jane Doe"
						u.Name = &name
					}),
				}
				mockRepo.EXPECT().
					GetUsersWithBirthday(mock.Anything, mock.Anything).
					Return(users, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name: "error from service",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				mockRepo.EXPECT().
					GetUsersWithBirthday(mock.Anything, mock.Anything).
					Return(nil, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
		{
			name: "users without names",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				users := []model.User{
					testutil.NewFakeStruct[model.User](func(u *model.User) {
						u.Name = nil
					}),
				}
				mockRepo.EXPECT().
					GetUsersWithBirthday(mock.Anything, mock.Anything).
					Return(users, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockUserRepo := mocks.NewUserRepo(t)
			tt.setupMocks(mockUserRepo)

			userService := service.NewUserService(mockUserRepo)
			handler := api.BirthdaysTodayHandler(testutil.NewTestLogger(), userService)

			req := httptest.NewRequest(http.MethodGet, "/birthdays", nil)
			w := httptest.NewRecorder()

			status, err := handler(w, req)

			if tt.expectError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
			assert.Equal(t, tt.expectedStatus, status)
		})
	}
}
