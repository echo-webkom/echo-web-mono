package api_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/adapters/http/dto"
	"uno/adapters/http/routes/api"

	"github.com/stretchr/testify/assert"
)

// Test health check endpoint
func TestHealthHandler(t *testing.T) {
	handler := api.HealthHandler()

	req := httptest.NewRequest(http.MethodGet, "/", nil)
	w := httptest.NewRecorder()

	status, err := handler(w, req)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, status)

	var response dto.HealthCheckResponse
	err = json.NewDecoder(w.Body).Decode(&response)
	assert.NoError(t, err)
	assert.Equal(t, "ok", response.Status)
}
