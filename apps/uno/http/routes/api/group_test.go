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

func TestGetGroupByIDHandler(t *testing.T) {
	tests := []struct {
		name           string
		groupID        string
		setupMocks     func(*mocks.GroupRepo)
		expectedStatus int
	}{
		{
			name:    "success",
			groupID: "group-1",
			setupMocks: func(mockRepo *mocks.GroupRepo) {
				mockRepo.EXPECT().
					GetGroupByID(mock.Anything, "group-1").
					Return(model.Group{ID: "group-1", Name: "Group One"}, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:    "not found",
			groupID: "group-1",
			setupMocks: func(mockRepo *mocks.GroupRepo) {
				mockRepo.EXPECT().
					GetGroupByID(mock.Anything, "group-1").
					Return(model.Group{}, errors.New("sql: no rows in result set")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockGroupRepo := mocks.NewGroupRepo(t)
			tt.setupMocks(mockGroupRepo)

			groupService := service.NewGroupService(mockGroupRepo)
			mux := api.NewGroupMux(testutil.NewTestLogger(), groupService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodGet, "/"+tt.groupID, nil)
			r.SetPathValue("id", tt.groupID)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestAddUserToGroupHandler(t *testing.T) {
	tests := []struct {
		name           string
		groupID        string
		userID         string
		setupMocks     func(*mocks.GroupRepo)
		expectedStatus int
	}{
		{
			name:    "success",
			groupID: "group-1",
			userID:  "user-1",
			setupMocks: func(mockRepo *mocks.GroupRepo) {
				mockRepo.EXPECT().
					GetUserGroupMembership(mock.Anything, "group-1", "user-1").
					Return(nil, nil).
					Once()
				mockRepo.EXPECT().
					GetGroupByID(mock.Anything, "group-1").
					Return(model.Group{ID: "group-1"}, nil).
					Once()
				mockRepo.EXPECT().
					AddUserToGroup(mock.Anything, "group-1", "user-1").
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:    "already member",
			groupID: "group-1",
			userID:  "user-1",
			setupMocks: func(mockRepo *mocks.GroupRepo) {
				mockRepo.EXPECT().
					GetUserGroupMembership(mock.Anything, "group-1", "user-1").
					Return(&model.UsersToGroups{UserID: "user-1", GroupID: "group-1"}, nil).
					Once()
			},
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:    "group not found",
			groupID: "group-1",
			userID:  "user-1",
			setupMocks: func(mockRepo *mocks.GroupRepo) {
				mockRepo.EXPECT().
					GetUserGroupMembership(mock.Anything, "group-1", "user-1").
					Return(nil, nil).
					Once()
				mockRepo.EXPECT().
					GetGroupByID(mock.Anything, "group-1").
					Return(model.Group{}, errors.New("sql: no rows in result set")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockGroupRepo := mocks.NewGroupRepo(t)
			tt.setupMocks(mockGroupRepo)

			groupService := service.NewGroupService(mockGroupRepo)
			mux := api.NewGroupMux(testutil.NewTestLogger(), groupService, handler.NoMiddleware)

			body, _ := json.Marshal(map[string]string{"userId": tt.userID})
			r := httptest.NewRequest(http.MethodPost, "/"+tt.groupID+"/members", bytes.NewReader(body))
			r.SetPathValue("id", tt.groupID)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestRemoveUserFromGroupHandler(t *testing.T) {
	tests := []struct {
		name           string
		groupID        string
		userID         string
		setupMocks     func(*mocks.GroupRepo)
		expectedStatus int
	}{
		{
			name:    "success",
			groupID: "group-1",
			userID:  "user-1",
			setupMocks: func(mockRepo *mocks.GroupRepo) {
				mockRepo.EXPECT().
					GetUserGroupMembership(mock.Anything, "group-1", "user-1").
					Return(&model.UsersToGroups{UserID: "user-1", GroupID: "group-1", IsLeader: false}, nil).
					Once()
				mockRepo.EXPECT().
					RemoveUserFromGroup(mock.Anything, "group-1", "user-1").
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:    "member is leader",
			groupID: "group-1",
			userID:  "user-1",
			setupMocks: func(mockRepo *mocks.GroupRepo) {
				mockRepo.EXPECT().
					GetUserGroupMembership(mock.Anything, "group-1", "user-1").
					Return(&model.UsersToGroups{UserID: "user-1", GroupID: "group-1", IsLeader: true}, nil).
					Once()
			},
			expectedStatus: http.StatusBadRequest,
		},
		{
			name:    "member not found",
			groupID: "group-1",
			userID:  "user-1",
			setupMocks: func(mockRepo *mocks.GroupRepo) {
				mockRepo.EXPECT().
					GetUserGroupMembership(mock.Anything, "group-1", "user-1").
					Return(nil, nil).
					Once()
			},
			expectedStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockGroupRepo := mocks.NewGroupRepo(t)
			tt.setupMocks(mockGroupRepo)

			groupService := service.NewGroupService(mockGroupRepo)
			mux := api.NewGroupMux(testutil.NewTestLogger(), groupService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodDelete, "/"+tt.groupID+"/members/"+tt.userID, nil)
			r.SetPathValue("id", tt.groupID)
			r.SetPathValue("userId", tt.userID)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}

func TestSetGroupMemberLeaderHandler(t *testing.T) {
	tests := []struct {
		name           string
		groupID        string
		userID         string
		leader         bool
		setupMocks     func(*mocks.GroupRepo)
		expectedStatus int
	}{
		{
			name:    "success",
			groupID: "group-1",
			userID:  "user-1",
			leader:  true,
			setupMocks: func(mockRepo *mocks.GroupRepo) {
				mockRepo.EXPECT().
					GetUserGroupMembership(mock.Anything, "group-1", "user-1").
					Return(&model.UsersToGroups{UserID: "user-1", GroupID: "group-1", IsLeader: false}, nil).
					Once()
				mockRepo.EXPECT().
					SetGroupMemberLeader(mock.Anything, "group-1", "user-1", true).
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusOK,
		},
		{
			name:    "member not found",
			groupID: "group-1",
			userID:  "user-1",
			leader:  true,
			setupMocks: func(mockRepo *mocks.GroupRepo) {
				mockRepo.EXPECT().
					GetUserGroupMembership(mock.Anything, "group-1", "user-1").
					Return(nil, nil).
					Once()
			},
			expectedStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockGroupRepo := mocks.NewGroupRepo(t)
			tt.setupMocks(mockGroupRepo)

			groupService := service.NewGroupService(mockGroupRepo)
			mux := api.NewGroupMux(testutil.NewTestLogger(), groupService, handler.NoMiddleware)

			body, _ := json.Marshal(map[string]bool{"leader": tt.leader})
			r := httptest.NewRequest(http.MethodPost, "/"+tt.groupID+"/members/"+tt.userID+"/leader", bytes.NewReader(body))
			r.SetPathValue("id", tt.groupID)
			r.SetPathValue("userId", tt.userID)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}
