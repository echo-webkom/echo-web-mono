package port

import (
	"context"
	"uno/domain/model"
)

type DotRepo interface {
	DeleteExpired(ctx context.Context) error
	CreateDot(ctx context.Context, dot model.NewDot) (model.Dot, error)
}
