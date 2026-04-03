package cache

import (
	"context"
	"uno/domain/port"

	"github.com/redis/go-redis/v9"
)

// RedisInvalidator deletes all keys under a given namespace from Redis.
// It is used to invalidate an entire group of related cache entries (e.g. when
// a Sanity webhook signals that content has changed).
type RedisInvalidator struct {
	logger port.Logger
	client *redis.Client
}

func NewRedisInvalidator(logger port.Logger, client *redis.Client) *RedisInvalidator {
	return &RedisInvalidator{logger: logger, client: client}
}

// InvalidateNamespace deletes all keys matching "namespace:*" using SCAN + DEL.
func (r *RedisInvalidator) InvalidateNamespace(ctx context.Context, namespace string) {
	pattern := namespace + ":*"
	var cursor uint64

	for {
		keys, nextCursor, err := r.client.Scan(ctx, cursor, pattern, 100).Result()
		if err != nil {
			r.logger.Error(ctx, "failed to scan Redis keys for invalidation", "error", err)
		}
		if len(keys) > 0 {
			if err := r.client.Del(ctx, keys...).Err(); err != nil {
				r.logger.Error(ctx, "failed to delete Redis keys for invalidation", "error", err)
			}
		}
		cursor = nextCursor
		if cursor == 0 {
			break
		}
	}
}

// NoopInvalidator is used when Redis is not configured.
// Cache invalidation has no effect with in-memory caches (they are per-instance).
type NoopInvalidator struct{}

func (NoopInvalidator) InvalidateNamespace(_ context.Context, _ string) {}
