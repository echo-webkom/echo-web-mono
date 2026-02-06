package router_test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/http/handler"
	"uno/http/router"

	"github.com/stretchr/testify/assert"
)

// Test that it rejects requests with missing or invalid admin API key
func TestAdminMiddleware_Unauthorized(t *testing.T) {
	adminKey := "some-secret-key"

	middleware := router.NewAdminMiddleware(adminKey)

	h := middleware(handler.Handler(func(ctx *handler.Context) error {
		return ctx.Ok()
	}))

	r := httptest.NewRequest(http.MethodGet, "/some-endpoint", nil)
	w := httptest.NewRecorder()

	// No admin key
	r.Header.Set("X-Admin-Key", "")

	ctx := handler.NewContext(w, r)
	h.ServeHTTP(ctx, ctx.R)
	assert.Equal(t, 401, ctx.Status())
}

// Test that it allows requests with valid admin API key
func TestAdminMiddleware_Authorized(t *testing.T) {
	adminKey := "some-secret-key"

	middleware := router.NewAdminMiddleware(adminKey)

	h := middleware(handler.Handler(func(ctx *handler.Context) error {
		return ctx.Ok()
	}))

	r := httptest.NewRequest(http.MethodGet, "/some-endpoint", nil)
	w := httptest.NewRecorder()

	// Valid admin key
	r.Header.Set("X-Admin-Key", adminKey)

	ctx := handler.NewContext(w, r)
	h.ServeHTTP(ctx, ctx.R)
	err := ctx.GetError()

	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}

	assert.Equal(t, 200, ctx.Status())
}
