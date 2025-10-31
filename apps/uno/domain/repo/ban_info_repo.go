package repo

import "context"

type BanInfoRepo interface {
	DeleteExpired(ctx context.Context) error
}
