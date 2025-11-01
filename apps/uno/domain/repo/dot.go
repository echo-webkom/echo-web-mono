package repo

import "context"

type DotRepo interface {
	DeleteExpired(ctx context.Context) error
}
