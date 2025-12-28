package handler

type Handler func(ctx *Context) error
type Middleware func(h Handler) Handler

func NoMiddleware(h Handler) Handler {
	return h
}
