package router_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/adapters/http/router"

	"github.com/stretchr/testify/assert"
)

// Test that it rejects requests with missing or invalid admin API key
func TestAdminMiddleware_Unauthorized(t *testing.T) {
	adminKey := "some-secret-key"

	middleware := router.NewAdminMiddleware(adminKey)

	handler := middleware(func(w http.ResponseWriter, r *http.Request) (int, error) {
		return 200, nil
	})

	req := httptest.NewRequest(http.MethodGet, "/some-endpoint", nil)
	w := httptest.NewRecorder()

	// No admin key
	req.Header.Set("X-Admin-Key", "")

	status, _ := handler(w, req)
	assert.Equal(t, 401, status)
}

// Test that it allows requests with valid admin API key
func TestAdminMiddleware_Authorized(t *testing.T) {
	adminKey := "some-secret-key"

	middleware := router.NewAdminMiddleware(adminKey)

	handler := middleware(func(w http.ResponseWriter, r *http.Request) (int, error) {
		return 200, nil
	})

	req := httptest.NewRequest(http.MethodGet, "/some-endpoint", nil)
	w := httptest.NewRecorder()

	// Valid admin key
	req.Header.Set("X-Admin-Key", adminKey)

	status, err := handler(w, req)
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	assert.Equal(t, 200, status)
}
