package api_test

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/domain/model"
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
	}{
		{
			name: "success",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				users := []model.UserWithStrikes{
					{},
				}
				mockRepo.EXPECT().
					GetUsersWithStrikes(mock.Anything).
					Return(users, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
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
	}{
		{
			name: "success",
			setupMocks: func(mockRepo *mocks.UserRepo) {
				users := []model.UserWithBanInfo{
					{},
				}
				mockRepo.EXPECT().
					GetBannedUsers(mock.Anything).
					Return(users, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
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

func TestAddStrikeHandler(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    map[string]interface{}
		setupMocks     func(*mocks.DotRepo, *mocks.BanInfoRepo, *mocks.UserRepo)
		expectedStatus int
	}{
		{
			name: "success",
			requestBody: map[string]interface{}{
				"userId":                "user-1",
				"count":                 1,
				"reason":                "rule break",
				"strikeExpiresInMonths": 1,
				"banExpiresInMonths":    1,
				"strikedBy":             "admin-1",
			},
			setupMocks: func(mockDotRepo *mocks.DotRepo, mockBanInfoRepo *mocks.BanInfoRepo, mockUserRepo *mocks.UserRepo) {
				mockUserRepo.EXPECT().
					GetUserByID(mock.Anything, "user-1").
					Return(testutil.NewFakeStruct[model.User](), nil).
					Once()
				mockBanInfoRepo.EXPECT().
					GetBanInfoByUserID(mock.Anything, "user-1").
					Return(nil, nil).
					Once()
				mockUserRepo.EXPECT().
					GetUsersWithStrikes(mock.Anything).
					Return([]model.UserWithStrikes{}, nil).
					Once()
				mockDotRepo.EXPECT().
					CreateDot(mock.Anything, mock.Anything).
					Return(testutil.NewFakeStruct[model.Dot](), nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name: "missing required fields",
			requestBody: map[string]interface{}{
				"userId": "",
			},
			setupMocks:     func(mockDotRepo *mocks.DotRepo, mockBanInfoRepo *mocks.BanInfoRepo, mockUserRepo *mocks.UserRepo) {},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDotRepo := mocks.NewDotRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)
			tt.setupMocks(mockDotRepo, mockBanInfoRepo, mockUserRepo)

			strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)
			mux := api.NewStrikesMux(testutil.NewTestLogger(), strikeService, handler.NoMiddleware)

			body, _ := json.Marshal(tt.requestBody)
			r := httptest.NewRequest(http.MethodPost, "/", bytes.NewReader(body))
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestRemoveBanHandler(t *testing.T) {
	tests := []struct {
		name           string
		userID         string
		setupMocks     func(*mocks.BanInfoRepo)
		expectedStatus int
	}{
		{
			name:   "success",
			userID: "user-1",
			setupMocks: func(mockBanInfoRepo *mocks.BanInfoRepo) {
				mockBanInfoRepo.EXPECT().
					DeleteBanByUserID(mock.Anything, "user-1").
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:           "missing user id",
			userID:         "",
			setupMocks:     func(mockBanInfoRepo *mocks.BanInfoRepo) {},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDotRepo := mocks.NewDotRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)
			tt.setupMocks(mockBanInfoRepo)

			strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)
			mux := api.NewStrikesMux(testutil.NewTestLogger(), strikeService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodDelete, "/ban/"+tt.userID, nil)
			r.SetPathValue("userId", tt.userID)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestRemoveStrikeHandler(t *testing.T) {
	tests := []struct {
		name           string
		id             string
		query          string
		setupMocks     func(*mocks.DotRepo)
		expectedStatus int
	}{
		{
			name:  "success",
			id:    "12",
			query: "?userId=user-1",
			setupMocks: func(mockDotRepo *mocks.DotRepo) {
				mockDotRepo.EXPECT().
					DeleteDotByIDAndUserID(mock.Anything, 12, "user-1").
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:           "missing user id",
			id:             "12",
			query:          "",
			setupMocks:     func(mockDotRepo *mocks.DotRepo) {},
			expectedStatus: http.StatusBadRequest,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDotRepo := mocks.NewDotRepo(t)
			mockBanInfoRepo := mocks.NewBanInfoRepo(t)
			mockUserRepo := mocks.NewUserRepo(t)
			tt.setupMocks(mockDotRepo)

			strikeService := service.NewStrikeService(mockDotRepo, mockBanInfoRepo, mockUserRepo)
			mux := api.NewStrikesMux(testutil.NewTestLogger(), strikeService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodDelete, "/"+tt.id+tt.query, nil)
			r.SetPathValue("id", tt.id)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}
