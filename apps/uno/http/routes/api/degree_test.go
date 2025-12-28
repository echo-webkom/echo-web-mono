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
			mux := api.NewDegreeMux(testutil.NewTestLogger(), degreeService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodGet, "/", nil)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
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
			mux := api.NewDegreeMux(testutil.NewTestLogger(), degreeService, handler.NoMiddleware)

			var r *http.Request
			if tt.name == "invalid json" {
				r = httptest.NewRequest(http.MethodPost, "/", nil)
			} else {
				body, _ := json.Marshal(tt.requestBody)
				r = httptest.NewRequest(http.MethodPost, "/", bytes.NewReader(body))
			}
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
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
			mux := api.NewDegreeMux(testutil.NewTestLogger(), degreeService, handler.NoMiddleware)

			var r *http.Request
			if tt.name == "invalid json" {
				r = httptest.NewRequest(http.MethodPost, "/123", nil)
			} else {
				body, _ := json.Marshal(tt.requestBody)
				r = httptest.NewRequest(http.MethodPost, "/123", bytes.NewReader(body))
			}
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
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
			expectedStatus: http.StatusMethodNotAllowed,
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
			mux := api.NewDegreeMux(testutil.NewTestLogger(), degreeService, handler.NoMiddleware)

			r := httptest.NewRequest(http.MethodDelete, "/"+tt.degreeID, nil)
			r.SetPathValue("id", tt.degreeID)
			w := httptest.NewRecorder()

			mux.ServeHTTP(w, r)

			assert.Equal(t, tt.expectedStatus, w.Code)
		})
	}
}
