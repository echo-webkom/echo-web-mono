package port

import "context"

type CacheInvalidator interface {
	InvalidateNamespace(ctx context.Context, namespace string) error
}
