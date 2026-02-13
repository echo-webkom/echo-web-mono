package jobs

import (
	"io"
	"net/http"
	"net/http/httptest"
	"testing"
	"uno/testutil"

	"github.com/stretchr/testify/assert"
)

func TestCloseProgrammerBarJobRun(t *testing.T) {
	var method string
	var body string

	ts := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		method = r.Method
		bytes, _ := io.ReadAll(r.Body)
		body = string(bytes)
		w.WriteHeader(http.StatusAccepted)
	}))
	defer ts.Close()

	job := NewCloseProgrammerBar(ts.Client(), &testutil.NoOpLogger{})
	job.url = ts.URL

	err := job.Run(t.Context())

	assert.NoError(t, err)
	assert.Equal(t, http.MethodPost, method)
	assert.Equal(t, `{"status":0}`, body)
}
