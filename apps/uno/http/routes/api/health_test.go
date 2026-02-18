package api_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/routes/api"

	"github.com/stretchr/testify/assert"
)

// Test health check endpoint
func TestHealthHandler(t *testing.T) {
	r := httptest.NewRequest(http.MethodGet, "/", nil)
	w := httptest.NewRecorder()

	ctx := handler.NewContext(w, r)
	err := api.HealthHandler(ctx)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, ctx.Status())

	var response dto.HealthCheckResponse
	err = json.NewDecoder(w.Body).Decode(&response)
	assert.NoError(t, err)
	assert.Equal(t, "ok", response.Status)
}
