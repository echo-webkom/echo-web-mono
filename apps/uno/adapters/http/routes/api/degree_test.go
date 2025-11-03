package api_test

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/adapters/http/routes/api"
	"uno/domain/model"
	"uno/domain/services"
	"uno/infrastructure/postgres"

	"github.com/stretchr/testify/assert"
)

// Setup db, repo and service for degree tests
func setupDegreeTest(t *testing.T) (*postgres.Database, *services.DegreeService) {
	db := postgres.SetupTestDB(t)
	degreeRepo := postgres.NewDegreeRepo(db, nil)
	degreeService := services.NewDegreeService(degreeRepo)
	return db, degreeService
}

// Test getting degrees when none exist
func TestGetDegreesHandler_Empty(t *testing.T) {
	db, degreeService := setupDegreeTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.GetDegreesHandler(nil, degreeService)

	req := httptest.NewRequest(http.MethodGet, "/degrees", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var degrees []model.Degree
	err = json.NewDecoder(w.Body).Decode(&degrees)
	assert.NoError(t, err)
	assert.Len(t, degrees, 0)
}

// Test getting degrees when some exist
func TestGetDegreesHandler_WithData(t *testing.T) {
	db, degreeService := setupDegreeTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	_, _ = degreeService.DegreeRepo().CreateDegree(ctx, model.Degree{
		ID:   "DTEK",
		Name: "Datateknologi",
	})
	_, _ = degreeService.DegreeRepo().CreateDegree(ctx, model.Degree{
		ID:   "INF",
		Name: "Informatikk",
	})

	handler := api.GetDegreesHandler(nil, degreeService)

	req := httptest.NewRequest(http.MethodGet, "/degrees", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var degrees []model.Degree
	err = json.NewDecoder(w.Body).Decode(&degrees)
	assert.NoError(t, err)
	assert.Len(t, degrees, 2)

	ids := []string{degrees[0].ID, degrees[1].ID}
	assert.Contains(t, ids, "DTEK")
	assert.Contains(t, ids, "INF")
}

// Test creating a degree
func TestCreateDegreeHandler_Success(t *testing.T) {
	db, degreeService := setupDegreeTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.CreateDegreeHandler(nil, degreeService)

	degree := model.Degree{
		ID:   "DTEK",
		Name: "Datateknologi",
	}

	body, _ := json.Marshal(degree)
	req := httptest.NewRequest(http.MethodPost, "/degrees", bytes.NewReader(body))
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusCreated, status)

	var createdDegree model.Degree
	err = json.NewDecoder(w.Body).Decode(&createdDegree)
	assert.NoError(t, err)
	assert.Equal(t, "DTEK", createdDegree.ID)
	assert.Equal(t, "Datateknologi", createdDegree.Name)
}

// Test creating a degree with invalid JSON
func TestCreateDegreeHandler_InvalidJSON(t *testing.T) {
	db, degreeService := setupDegreeTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.CreateDegreeHandler(nil, degreeService)

	req := httptest.NewRequest(http.MethodPost, "/degrees", bytes.NewReader([]byte("invalid json")))
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.Error(t, err)
	assert.Equal(t, http.StatusBadRequest, status)
}

// Test updating a degree
func TestUpdateDegreeHandler_Success(t *testing.T) {
	db, degreeService := setupDegreeTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	_, _ = degreeService.DegreeRepo().CreateDegree(ctx, model.Degree{
		ID:   "DTEK",
		Name: "Datateknologi",
	})

	handler := api.UpdateDegreeHandler(nil, degreeService)

	updatedDegree := model.Degree{
		ID:   "DTEK",
		Name: "Data Technology",
	}

	body, _ := json.Marshal(updatedDegree)
	req := httptest.NewRequest(http.MethodPost, "/degrees/DTEK", bytes.NewReader(body))
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var result model.Degree
	err = json.NewDecoder(w.Body).Decode(&result)
	assert.NoError(t, err)
	assert.Equal(t, "DTEK", result.ID)
	assert.Equal(t, "Data Technology", result.Name)
}

// Test updating a degree with invalid JSON
func TestUpdateDegreeHandler_InvalidJSON(t *testing.T) {
	db, degreeService := setupDegreeTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.UpdateDegreeHandler(nil, degreeService)

	req := httptest.NewRequest(http.MethodPost, "/degrees/DTEK", bytes.NewReader([]byte("invalid")))
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.Error(t, err)
	assert.Equal(t, http.StatusBadRequest, status)
}

// Test deleting a degree
func TestDeleteDegreeHandler_Success(t *testing.T) {
	db, degreeService := setupDegreeTest(t)
	defer func() {
		_ = db.Close()
	}()

	ctx := context.Background()

	_, _ = degreeService.DegreeRepo().CreateDegree(ctx, model.Degree{
		ID:   "DTEK",
		Name: "Datateknologi",
	})

	handler := api.DeleteDegreeHandler(nil, degreeService)

	req := httptest.NewRequest(http.MethodDelete, "/degrees/DTEK", nil)
	req.SetPathValue("id", "DTEK")
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusNoContent, status)

	degrees, _ := degreeService.DegreeRepo().GetAllDegrees(ctx)
	assert.Len(t, degrees, 0)
}

// Test deleting a degree with missing ID
func TestDeleteDegreeHandler_MissingID(t *testing.T) {
	db, degreeService := setupDegreeTest(t)
	defer func() {
		_ = db.Close()
	}()

	handler := api.DeleteDegreeHandler(nil, degreeService)

	req := httptest.NewRequest(http.MethodDelete, "/degrees/", nil)
	// Test when no ID is set in path
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusBadRequest, status)
}
