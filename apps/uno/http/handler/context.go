package handler

import (
	"context"
	"encoding/json"
	"net/http"
)

type Context struct {
	R        *http.Request
	W        http.ResponseWriter
	status   int
	err      error
	readBody bool // indicate to close body
}

func NewContext(w http.ResponseWriter, r *http.Request) *Context {
	return &Context{r, w, 200, nil, false}
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

func (c *Context) Ok() error {
	return nil
}

func (c *Context) Context() context.Context {
	return c.R.Context()
}

func (c *Context) String(s string) error {
	_, err := c.W.Write([]byte(s))
	return err
}

func (c *Context) JSON(data any) error {
	return json.NewEncoder(c.W).Encode(data)
}

func (c *Context) Error(err error, status int) error {
	http.Error(c.W, err.Error(), status)
	c.status = status
	return err
}

func (c *Context) GetError() error {
	return c.err
}

func (c *Context) ServeFile(filepath string) error {
	http.ServeFile(c.W, c.R, filepath)
	return nil
}

func (c *Context) SetCookie(cookie *http.Cookie) {
	http.SetCookie(c.W, cookie)
}

func (c *Context) Redirect(url string) error {
	http.Redirect(c.W, c.R, url, http.StatusSeeOther)
	return nil
}

func (c *Context) QueryParam(key string) string {
	return c.R.URL.Query().Get(key)
}

func (c *Context) Status() int {
	return c.status
}

func (c *Context) HeaderValue(key string) string {
	return c.R.Header.Get(key)
}
