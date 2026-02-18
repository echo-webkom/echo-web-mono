package cache

import (
	"sync"
	"time"
)

type CacheEntry[T any] struct {
	Data      T
	ExpiresAt time.Time
}

// Valid checks if the cache entry is still valid based on the expiration time.
// If ExpiresAt is zero, it means the entry does not expire and is always valid.
func (c *CacheEntry[T]) Valid() bool {
	if c.ExpiresAt.IsZero() {
		return true
	}
	return time.Now().Before(c.ExpiresAt)
}

// Cache is a simple interface for caching values with string keys.
// It supports getting, setting with an optional TTL, and deleting entries.
// The cache is thread-safe and can be used concurrently.
// Note: It does not automatically evict expired entries. Also it is only
// in-memory, so different instances of the application will not share the
// same cache. It situations where this is needed, you should consider
// caching with PostgreSQL or Redis instead.
type InMemoryCache[T any] struct {
	mu      sync.RWMutex
	entries map[string]CacheEntry[T]
}

// NewInMemoryCache creates a new instance of InMemoryCache.
func NewInMemoryCache[T any]() *InMemoryCache[T] {
	return &InMemoryCache[T]{
		entries: map[string]CacheEntry[T]{},
	}
}

// Get retrieves a value from the cache. It returns the value and a boolean indicating whether the key was found and valid.
func (c *InMemoryCache[T]) Get(key string) (T, bool) {
	c.mu.RLock()
	entry, ok := c.entries[key]
	c.mu.RUnlock()

	if !ok {
		var zero T
		return zero, false
	}

	if entry.Valid() {
		return entry.Data, true
	}

	c.mu.Lock()
	delete(c.entries, key)
	c.mu.Unlock()

	var zero T
	return zero, false
}

// Set adds a value to the cache with an optional TTL. If ttl is zero or negative, the entry will not expire.
func (c *InMemoryCache[T]) Set(key string, data T, ttl time.Duration) {
	c.mu.Lock()
	defer c.mu.Unlock()

	entry := CacheEntry[T]{Data: data}
	if ttl > 0 {
		entry.ExpiresAt = time.Now().Add(ttl)
	}
	c.entries[key] = entry
}

// Delete removes a key from the cache.
func (c *InMemoryCache[T]) Delete(key string) {
	c.mu.Lock()
	defer c.mu.Unlock()

	delete(c.entries, key)
}
