package cache

import (
	"context"

	"github.com/redis/go-redis/v9"
)

// RedisInvalidator deletes all keys under a given namespace from Redis.
// It is used to invalidate an entire group of related cache entries (e.g. when
// a Sanity webhook signals that content has changed).
type RedisInvalidator struct {
	client *redis.Client
}

func NewRedisInvalidator(client *redis.Client) *RedisInvalidator {
	return &RedisInvalidator{client: client}
}

// InvalidateNamespace deletes all keys matching "namespace:*" using SCAN + DEL.
func (r *RedisInvalidator) InvalidateNamespace(ctx context.Context, namespace string) error {
	pattern := namespace + ":*"
	var cursor uint64

	for {
		keys, nextCursor, err := r.client.Scan(ctx, cursor, pattern, 100).Result()
		if err != nil {
			return err
		}
		if len(keys) > 0 {
			if err := r.client.Del(ctx, keys...).Err(); err != nil {
				return err
			}
		}
		cursor = nextCursor
		if cursor == 0 {
			break
		}
	}

	return nil
}

// NoopInvalidator is used when Redis is not configured.
// Cache invalidation has no effect with in-memory caches (they are per-instance).
type NoopInvalidator struct{}

func (NoopInvalidator) InvalidateNamespace(_ context.Context, _ string) error {
	return nil
}
