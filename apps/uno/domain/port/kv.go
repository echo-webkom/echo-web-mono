package port

import "context"

type KVRepo interface {
	DeleteExpired(ctx context.Context) (int64, error)
}
