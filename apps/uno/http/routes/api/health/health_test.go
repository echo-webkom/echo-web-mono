package health_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/http/routes/api/health"
	"uno/pkg/uno"

	"github.com/stretchr/testify/assert"
)

// Test health check endpoint
func TestHealthHandler(t *testing.T) {
	r := httptest.NewRequest(http.MethodGet, "/", nil)
	w := httptest.NewRecorder()

	ctx := uno.NewContext(w, r)
	err := health.HealthHandler(ctx)

	assert.NoError(t, err)
	assert.Equal(t, http.StatusOK, ctx.Status())

	var response health.HealthCheckResponse
	err = json.NewDecoder(w.Body).Decode(&response)
	assert.NoError(t, err)
	assert.Equal(t, "ok", response.Status)
}
