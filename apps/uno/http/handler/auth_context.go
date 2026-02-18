package handler

import (
	"context"
	"uno/domain/model"
)

type authContextKey int

const (
	userContextKey authContextKey = iota
	sessionContextKey
)

func WithUser(ctx context.Context, user model.User) context.Context {
	return context.WithValue(ctx, userContextKey, user)
}

func UserFromContext(ctx context.Context) (model.User, bool) {
	user, ok := ctx.Value(userContextKey).(model.User)
	return user, ok
}

func WithSession(ctx context.Context, session model.Session) context.Context {
	return context.WithValue(ctx, sessionContextKey, session)
}

func SessionFromContext(ctx context.Context) (model.Session, bool) {
	session, ok := ctx.Value(sessionContextKey).(model.Session)
	return session, ok
}
