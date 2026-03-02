package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"mime/multipart"
	"net/http"
	"net/http/httptest"
	"strconv"
	"time"
)

type Context struct {
	R *http.Request

	w           http.ResponseWriter
	status      int
	err         error
	bytes       int
	readBody    bool // indicate to close body
	wroteHeader bool
	createdAt   time.Time
}

func NewContext(w http.ResponseWriter, r *http.Request) *Context {
	return &Context{
		R:         r,
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
	if c.wroteHeader {
		return
	}
	c.status = code
	c.wroteHeader = true
	c.w.WriteHeader(code)
}

func (c *Context) Write(b []byte) (int, error) {
	// If WriteHeader was never called, default is 200
	if c.status == 0 {
		c.status = http.StatusOK
	}
	c.wroteHeader = true
	c.bytes += len(b)
	return c.w.Write(b)
}

func (c *Context) Header() http.Header {
	return c.w.Header()
}

func (c *Context) SetHeader(key, value string) {
	c.w.Header().Set(key, value)
}

func (c *Context) FormFile(key string) (multipart.File, error) {
	if err := c.R.ParseMultipartForm(32 << 20); err != nil {
		return nil, c.Error(fmt.Errorf("failed to parse multipart form: %w", err), http.StatusBadRequest)
	}
	file, _, err := c.R.FormFile(key)
	if err != nil {
		return nil, c.Error(fmt.Errorf("failed to get form file: %w", err), http.StatusBadRequest)
	}
	return file, nil
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

// BadRequest returns a 400 Bad Request error response with the given error message.
// This does not mark the context as having an error, since we consider 400 as a normal response for invalid client input.
// If you want to mark the context as having an error, use c.Error() instead.
func (c *Context) BadRequest(err error) {
	c.status = http.StatusBadRequest
	http.Error(c, err.Error(), http.StatusBadRequest)
}

// Unauthorized returns a 401 Unauthorized error response with the given error message.
// This does not mark the context as having an error, since we consider 401 as a normal response for unauthenticated access.
// If you want to mark the context as having an error, use c.Error() instead.
func (c *Context) Unauthorized(err error) {
	c.status = http.StatusUnauthorized
	http.Error(c, err.Error(), http.StatusUnauthorized)
}

// Forbidden returns a 403 Forbidden error response with the given error message.
// This does not mark the context as having an error, since we consider 403 as a normal response for unauthorized access.
// If you want to mark the context as having an error, use c.Error() instead.
func (c *Context) Forbidden(err error) {
	c.status = http.StatusForbidden
	http.Error(c, err.Error(), http.StatusForbidden)
}

// NotFound returns a 404 Not Found error response with the given error message.
// This does not mark the context as having an error, since we consider 404 as a normal response.
// If you want to mark the context as having an error, use c.Error() instead.
func (c *Context) NotFound(err error) {
	c.status = http.StatusNotFound
	http.Error(c, err.Error(), http.StatusNotFound)
}

// MethodNotAllowed returns a 405 Method Not Allowed error response with the given error message.
func (c *Context) MethodNotAllowed(err error) error {
	return c.Error(err, http.StatusMethodNotAllowed)
}

// TooManyRequests returns a 429 Too Many Requests error response with the given error message.
func (c *Context) TooManyRequests(err error) error {
	return c.Error(err, http.StatusTooManyRequests)
}

// InternalServerError returns a 500 Internal Server Error response with the given error message.
func (c *Context) InternalServerError(err error) error {
	return c.Error(err, http.StatusInternalServerError)
}

// NotImplemented returns a 501 Not Implemented error response with the given error message.
func (c *Context) NotImplemented(err error) error {
	return c.Error(err, http.StatusNotImplemented)
}

// Error sets the error and status code in the context and writes the error response.
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

func (c *Context) Stream(r io.ReadCloser) error {
	var err error
	defer func() {
		err = r.Close()
	}()

	buf := make([]byte, 512)
	n, err := r.Read(buf)
	if err != nil && err != io.EOF {
		return err
	}

	c.SetHeader("Content-Type", http.DetectContentType(buf[:n]))
	_, err = io.Copy(c, io.MultiReader(bytes.NewReader(buf[:n]), r))
	return err
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

// Text returns a plain text response with the given string.
func (c *Context) Text(s string) error {
	c.SetHeader("Content-Type", "text/plain; charset=utf-8")
	_, err := c.Write([]byte(s))
	return err
}
