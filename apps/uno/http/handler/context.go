package handler

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strconv"
	"time"
)

type Context struct {
	R *http.Request

	info      *RequestInfo
	w         http.ResponseWriter
	status    int
	err       error
	bytes     int
	readBody  bool // indicate to close body
	createdAt time.Time
}

func NewContext(w http.ResponseWriter, r *http.Request) *Context {
	return &Context{
		R:         r,
		info:      &RequestInfo{},
		w:         w,
		status:    200,
		err:       nil,
		bytes:     0,
		readBody:  false,
		createdAt: time.Now(),
	}
}

func ReuseOrNewContext(w http.ResponseWriter, r *http.Request) *Context {
	if ctx, ok := w.(*Context); ok {
		ctx.R = r // may have changed with shallow copy in r.WithContext
		return ctx
	}
	return NewContext(w, r)
}

func (c *Context) WriteHeader(code int) {
	c.status = code
	c.w.WriteHeader(code)
}

func (c *Context) Write(b []byte) (int, error) {
	// If WriteHeader was never called, default is 200
	if c.status == 0 {
		c.status = http.StatusOK
	}
	c.bytes += len(b)
	return c.w.Write(b)
}

func (c *Context) Header() http.Header {
	return c.w.Header()
}

func (c *Context) Destroy() {
	_ = c.R.Body.Close()
}

func (c *Context) ReadJSON(dest any) error {
	return json.NewDecoder(c.R.Body).Decode(dest)
}

func (c *Context) PathValue(key string) string {
	return c.R.PathValue(key)
}

func (c *Context) PathValueInt(key string) (int, error) {
	s := c.R.PathValue(key)
	if n, err := strconv.Atoi(s); err == nil {
		return n, err
	}
	return 0, c.Error(fmt.Errorf("invalid integer literal: %s", s), http.StatusBadRequest)
}

func (c *Context) Ok() error {
	return nil
}

func (c *Context) Context() context.Context {
	return c.R.Context()
}

func (c *Context) SetContext(ctx context.Context) {
	c.R = c.R.WithContext(ctx)
}

func (c *Context) String(s string) error {
	_, err := c.Write([]byte(s))
	return err
}

func (c *Context) JSONWithStatus(data any, status int) error {
	c.SetStatus(status)
	return json.NewEncoder(c).Encode(data)
}

func (c *Context) JSON(data any) error {
	// Write status header if it's been set to non-default
	if c.status != 0 && c.status != 200 {
		c.WriteHeader(c.status)
	}
	return json.NewEncoder(c).Encode(data)
}

func (c *Context) SetStatus(status int) {
	c.status = status
	c.WriteHeader(status)
}

func (c *Context) Error(err error, status int) error {
	c.status = status
	c.err = err
	http.Error(c, err.Error(), status)
	return err
}

func (c *Context) GetError() error {
	return c.err
}

func (c *Context) ServeFile(filepath string) error {
	http.ServeFile(c, c.R, filepath)
	return nil
}

func (c *Context) SetCookie(cookie *http.Cookie) {
	http.SetCookie(c, cookie)
}

func (c *Context) Redirect(url string) error {
	http.Redirect(c, c.R, url, http.StatusSeeOther)
	return nil
}

func (c *Context) QueryParam(key string) (param string, ok bool) {
	param = c.R.URL.Query().Get(key)
	return param, param != ""
}

func (c *Context) Status() int {
	// If using httptest.ResponseRecorder, get status from it
	if recorder, ok := c.w.(*httptest.ResponseRecorder); ok {
		return recorder.Code
	}
	return c.status
}

func (c *Context) HeaderValue(key string) string {
	return c.R.Header.Get(key)
}

// Lifetime returns the duration since creation.
func (c *Context) Lifetime() time.Duration {
	return time.Since(c.createdAt)
}

func (c *Context) Bytes() int {
	return c.bytes
}

// Next calls the given http.Handler with the current context and returns the error set in the context.
func (c *Context) Next(h http.Handler) error {
	h.ServeHTTP(c, c.R)
	return c.GetError()
}

func (c *Context) Info() *RequestInfo {
	return c.info
}
