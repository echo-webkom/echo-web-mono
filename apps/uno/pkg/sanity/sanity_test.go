package sanity

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestNew(t *testing.T) {
	t.Run("returns error when project id is missing", func(t *testing.T) {
		client, err := New(Config{Dataset: "production"})
		require.Error(t, err)
		assert.ErrorIs(t, err, ErrMissingProjectID)
		assert.Nil(t, client)
	})

	t.Run("returns error when dataset is missing", func(t *testing.T) {
		client, err := New(Config{ProjectID: "abc123"})
		require.Error(t, err)
		assert.ErrorIs(t, err, ErrMissingDataset)
		assert.Nil(t, client)
	})
}

func TestQuery(t *testing.T) {
	t.Run("returns decoded result", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			assert.Equal(t, http.MethodGet, r.Method)
			assert.Equal(t, "application/json", r.Header.Get("Accept"))
			assert.Equal(t, "Bearer secret", r.Header.Get("Authorization"))
			assert.Equal(t, `*[_type == "post"]{title}`, r.URL.Query().Get("query"))
			assert.Equal(t, `"post-1"`, r.URL.Query().Get("$slug"))
			_, _ = w.Write([]byte(`{"result":[{"title":"Hello"}]}`))
		}))
		defer server.Close()

		previous := HttpClient
		HttpClient = server.Client()
		t.Cleanup(func() {
			HttpClient = previous
		})

		client := &Client{
			baseURL: server.URL + "/v2025-02-19/data/query/production",
			token:   "secret",
		}

		type post struct {
			Title string `json:"title"`
		}

		result, err := Query[[]post](context.Background(), client, `*[_type == "post"]{title}`, map[string]any{
			"slug": "post-1",
		})
		require.NoError(t, err)
		require.Len(t, result, 1)
		assert.Equal(t, "Hello", result[0].Title)
	})

	t.Run("returns error for non-200 responses", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.WriteHeader(http.StatusBadGateway)
		}))
		defer server.Close()

		previous := HttpClient
		HttpClient = server.Client()
		t.Cleanup(func() {
			HttpClient = previous
		})

		client := &Client{baseURL: server.URL}

		_, err := Query[map[string]any](context.Background(), client, `*[]`, nil)
		require.Error(t, err)
		assert.ErrorIs(t, err, ErrUnexpectedStatusCode)
	})

	t.Run("returns error when response json is invalid", func(t *testing.T) {
		server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			_, _ = w.Write([]byte(`{`))
		}))
		defer server.Close()

		previous := HttpClient
		HttpClient = server.Client()
		t.Cleanup(func() {
			HttpClient = previous
		})

		client := &Client{baseURL: server.URL}

		resp, err := Query[map[string]any](context.Background(), client, `*[]`, nil)
		require.Error(t, err)
		assert.ErrorIs(t, err, ErrFailedToDecodeData)
		assert.Equal(t, map[string]any(nil), resp)
	})
}
