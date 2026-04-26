package cache

import (
	"context"
	"encoding/json"
	"errors"
	"time"
	"uno/domain/port"

	"github.com/redis/go-redis/v9"
)

type RedisCache[T any] struct {
	client    *redis.Client
	namespace string
	logger    port.Logger
}

func NewRedisCache[T any](client *redis.Client, namespace string, logger port.Logger) *RedisCache[T] {
	return &RedisCache[T]{client: client, namespace: namespace, logger: logger}
}

// NewCache returns a RedisCache if client is non-nil, otherwise an InMemoryCache.
// The namespace is used to prefix all Redis keys to prevent collisions between cache instances.
func NewCache[T any](client *redis.Client, namespace string, logger port.Logger) port.Cache[T] {
	if client != nil {
		return NewRedisCache[T](client, namespace, logger)
	}
	return NewInMemoryCache[T](logger)
}

func (c *RedisCache[T]) key(k string) string {
	return c.namespace + ":" + k
}

func (c *RedisCache[T]) Get(key string) (T, bool) {
	val, err := c.client.Get(context.Background(), c.key(key)).Bytes()
	if err != nil {
		if errors.Is(err, redis.Nil) {
			var zero T
			return zero, false
		}
		var zero T
		return zero, false
	}

	var result T
	if err := json.Unmarshal(val, &result); err != nil {
		var zero T
		return zero, false
	}

	return result, true
}

func (c *RedisCache[T]) Set(key string, value T, ttl time.Duration) {
	data, err := json.Marshal(value)
	if err != nil {
		c.logger.Error(context.Background(), "failed to marshal value for redis set", "key", c.key(key), "error", err)
		return
	}

	// ttl <= 0 means no expiration, matching InMemoryCache behavior
	expiry := time.Duration(0)
	if ttl > 0 {
		expiry = ttl
	}

	c.client.Set(context.Background(), c.key(key), data, expiry)
}

func (c *RedisCache[T]) Delete(key string) {
	c.client.Del(context.Background(), c.key(key))
}
