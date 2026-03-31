package cache

import (
	"context"
	"sync"
	"time"
)

type entry[V any] struct {
	value     V
	expiresAt time.Time
}

// Cache is a generic in-memory cache with a fixed TTL per entry.
type Cache[K comparable, V any] struct {
	mu      sync.Mutex
	entries map[K]entry[V]
	ttl     time.Duration
}

// New creates a new Cache with the given TTL applied to all entries.
func New[K comparable, V any](ttl time.Duration) *Cache[K, V] {
	return &Cache[K, V]{
		entries: make(map[K]entry[V]),
		ttl:     ttl,
	}
}

// GetOrSet returns the cached value for key if it exists and has not expired.
// Otherwise it calls fn to fetch the value, stores it, and returns it.
func (c *Cache[K, V]) GetOrSet(ctx context.Context, key K, fn func(context.Context) (V, error)) (V, error) {
	c.mu.Lock()
	if e, ok := c.entries[key]; ok && time.Now().Before(e.expiresAt) {
		c.mu.Unlock()
		return e.value, nil
	}
	c.mu.Unlock()

	value, err := fn(ctx)
	if err != nil {
		var zero V
		return zero, err
	}

	c.mu.Lock()
	c.entries[key] = entry[V]{value: value, expiresAt: time.Now().Add(c.ttl)}
	c.mu.Unlock()

	return value, nil
}
