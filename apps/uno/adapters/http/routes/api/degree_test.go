package api_test

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/adapters/http/routes/api"
	"uno/domain/model"
	"uno/domain/port/mocks"
	"uno/domain/service"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/mock"
)

func TestGetDegreesHandler(t *testing.T) {
	tests := []struct {
		name           string
		setupMocks     func(*mocks.DegreeRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name: "success",
			setupMocks: func(mockRepo *mocks.DegreeRepo) {
				degrees := []model.Degree{
					testutil.NewFakeStruct[model.Degree](),
				}
				mockRepo.EXPECT().
					GetAllDegrees(mock.Anything).
					Return(degrees, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name: "error from repo",
			setupMocks: func(mockRepo *mocks.DegreeRepo) {
				mockRepo.EXPECT().
					GetAllDegrees(mock.Anything).
					Return(nil, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDegreeRepo := mocks.NewDegreeRepo(t)
			tt.setupMocks(mockDegreeRepo)

			degreeService := service.NewDegreeService(mockDegreeRepo)
			handler := api.GetDegreesHandler(testutil.NewTestLogger(), degreeService)

			req := httptest.NewRequest(http.MethodGet, "/degrees", nil)
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

func TestCreateDegreeHandler(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    model.Degree
		setupMocks     func(*mocks.DegreeRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name:        "success",
			requestBody: testutil.NewFakeStruct[model.Degree](),
			setupMocks: func(mockRepo *mocks.DegreeRepo) {
				degree := testutil.NewFakeStruct[model.Degree]()
				mockRepo.EXPECT().
					CreateDegree(mock.Anything, mock.Anything).
					Return(degree, nil).
					Once()
			},
			expectedStatus: http.StatusCreated,
			expectError:    false,
		},
		{
			name:           "invalid json",
			requestBody:    model.Degree{},
			setupMocks:     func(mockRepo *mocks.DegreeRepo) {},
			expectedStatus: http.StatusBadRequest,
			expectError:    true,
		},
		{
			name:        "error from repo",
			requestBody: testutil.NewFakeStruct[model.Degree](),
			setupMocks: func(mockRepo *mocks.DegreeRepo) {
				mockRepo.EXPECT().
					CreateDegree(mock.Anything, mock.Anything).
					Return(model.Degree{}, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDegreeRepo := mocks.NewDegreeRepo(t)
			tt.setupMocks(mockDegreeRepo)

			degreeService := service.NewDegreeService(mockDegreeRepo)
			handler := api.CreateDegreeHandler(testutil.NewTestLogger(), degreeService)

			var req *http.Request
			if tt.name == "invalid json" {
				req = httptest.NewRequest(http.MethodPost, "/degrees", nil)
			} else {
				body, _ := json.Marshal(tt.requestBody)
				req = httptest.NewRequest(http.MethodPost, "/degrees", bytes.NewReader(body))
			}
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

func TestUpdateDegreeHandler(t *testing.T) {
	tests := []struct {
		name           string
		requestBody    model.Degree
		setupMocks     func(*mocks.DegreeRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name:        "success",
			requestBody: testutil.NewFakeStruct[model.Degree](),
			setupMocks: func(mockRepo *mocks.DegreeRepo) {
				degree := testutil.NewFakeStruct[model.Degree]()
				mockRepo.EXPECT().
					UpdateDegree(mock.Anything, mock.Anything).
					Return(degree, nil).
					Once()
			},
			expectedStatus: http.StatusOK,
			expectError:    false,
		},
		{
			name:           "invalid json",
			requestBody:    model.Degree{},
			setupMocks:     func(mockRepo *mocks.DegreeRepo) {},
			expectedStatus: http.StatusBadRequest,
			expectError:    true,
		},
		{
			name:        "error from repo",
			requestBody: testutil.NewFakeStruct[model.Degree](),
			setupMocks: func(mockRepo *mocks.DegreeRepo) {
				mockRepo.EXPECT().
					UpdateDegree(mock.Anything, mock.Anything).
					Return(model.Degree{}, errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDegreeRepo := mocks.NewDegreeRepo(t)
			tt.setupMocks(mockDegreeRepo)

			degreeService := service.NewDegreeService(mockDegreeRepo)
			handler := api.UpdateDegreeHandler(testutil.NewTestLogger(), degreeService)

			var req *http.Request
			if tt.name == "invalid json" {
				req = httptest.NewRequest(http.MethodPost, "/degrees/123", nil)
			} else {
				body, _ := json.Marshal(tt.requestBody)
				req = httptest.NewRequest(http.MethodPost, "/degrees/123", bytes.NewReader(body))
			}
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

func TestDeleteDegreeHandler(t *testing.T) {
	tests := []struct {
		name           string
		degreeID       string
		setupMocks     func(*mocks.DegreeRepo)
		expectedStatus int
		expectError    bool
	}{
		{
			name:     "success",
			degreeID: "degree123",
			setupMocks: func(mockRepo *mocks.DegreeRepo) {
				mockRepo.EXPECT().
					DeleteDegree(mock.Anything, "degree123").
					Return(nil).
					Once()
			},
			expectedStatus: http.StatusNoContent,
			expectError:    false,
		},
		{
			name:           "missing id",
			degreeID:       "",
			setupMocks:     func(mockRepo *mocks.DegreeRepo) {},
			expectedStatus: http.StatusBadRequest,
			expectError:    false,
		},
		{
			name:     "error from repo",
			degreeID: "degree123",
			setupMocks: func(mockRepo *mocks.DegreeRepo) {
				mockRepo.EXPECT().
					DeleteDegree(mock.Anything, "degree123").
					Return(errors.New("database error")).
					Once()
			},
			expectedStatus: http.StatusInternalServerError,
			expectError:    true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			mockDegreeRepo := mocks.NewDegreeRepo(t)
			tt.setupMocks(mockDegreeRepo)

			degreeService := service.NewDegreeService(mockDegreeRepo)
			handler := api.DeleteDegreeHandler(testutil.NewTestLogger(), degreeService)

			req := httptest.NewRequest(http.MethodDelete, "/degrees/"+tt.degreeID, nil)
			req.SetPathValue("id", tt.degreeID)
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
