package handler

import (
	"encoding/json"
	"errors"
	"net/http"
)

type Context struct {
	R *http.Request
	W http.ResponseWriter
}

func (c *Context) Ok() error {
	return nil
}

func (c *Context) String(s string) error {
	_, err := c.W.Write([]byte(s))
	return err
}

func (c *Context) JSON(data any) error {
	return json.NewEncoder(c.W).Encode(data)
}

func (c *Context) Error(msg string, status int) error {
	err := errors.New(msg)
	http.Error(c.W, err.Error(), status)
	return err
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
