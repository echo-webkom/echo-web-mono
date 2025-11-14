package api_test

import (
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/domain/port"
	"uno/domain/port/mocks"
	"uno/domain/service"
	"uno/http/handler"
	"uno/http/routes/api"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestUnbanUsersWithExpiredStrikesHandler(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.DotRepo, *mocks.BanInfoRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name: "success",
			setupMocks: func(mockDotRepo *mocks.DotRepo, mockBanInfoRepo *mocks.BanInfoRepo) {
				mockDotRepo.EXPECT().
					DeleteExpired(mock.Anything).
					Return(nil).
					Once()
				mockBanInfoRepo.EXPECT().
					DeleteExpired(mock.Anything).
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name: "error from dot repo",
			setupMocks: func(mockDotRepo *mocks.DotRepo, mockBanInfoRepo *mocks.BanInfoRepo) {
				mockDotRepo.EXPECT().
					DeleteExpired(mock.Anything).
					Return(errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
		{
			name: "error from ban info repo",
			setupMocks: func(mockDotRepo *mocks.DotRepo, mockBanInfoRepo *mocks.BanInfoRepo) {
				mockDotRepo.EXPECT().
					DeleteExpired(mock.Anything).
					Return(nil).
					Once()
				mockBanInfoRepo.EXPECT().
					DeleteExpired(mock.Anything).
					Return(errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDotRepo := mocks.NewDotRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)

			tt.setupMocks(mockDotRepo, mockBanInfoRepo)

			strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)
			mux := api.NewStrikesMux(testutil.NewTestLogger(), strikeService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodPost, "/unban", nil)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestGetUsersWithStrikesHandler(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.UserRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name: "success",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				users := []port.UserWithStrikes{
					{},
				}
				mockRepo.EXPECT().
					GetUsersWithStrikes(mock.Anything).
					Return(users, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name: "error from repo",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				mockRepo.EXPECT().
					GetUsersWithStrikes(mock.Anything).
					Return(nil, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDotRepo := mocks.NewDotRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)

			tt.setupMocks(mockUserRepo)

			strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)
			mux := api.NewStrikesMux(testutil.NewTestLogger(), strikeService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodGet, "/users", nil)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestGetBannedUsers(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.UserRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name: "success",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				users := []port.UserWithBanInfo{
					{},
				}
				mockRepo.EXPECT().
					GetBannedUsers(mock.Anything).
					Return(users, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name: "error from repo",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				mockRepo.EXPECT().
					GetBannedUsers(mock.Anything).
					Return(nil, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDotRepo := mocks.NewDotRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)

			tt.setupMocks(mockUserRepo)

			strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)
			mux := api.NewStrikesMux(testutil.NewTestLogger(), strikeService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodGet, "/banned", nil)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}
