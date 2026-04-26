package cache

import (
	"context"
	"testing"
	"time"
)

func TestRedisCache(t *testing.T) {
	client := SetupTestRedis(t)
	cache := NewRedisCache[string](client, "test", nil)

	// ttl <= 0 means no expiration
	cache.Set("key1", "value1", 0)
	value, ok := cache.Get("key1")
	if !ok || value != "value1" {
		t.Errorf("expected to get 'value1', got '%s'", value)
	}

	// non-existent key should miss
	_, ok = cache.Get("nonexistent")
	if ok {
		t.Error("expected to not find 'nonexistent' key")
	}

	// cache should be keyed, not single-slot
	cache.Set("key2", "value2", time.Minute)
	value, ok = cache.Get("key2")
	if !ok || value != "value2" {
		t.Errorf("expected to get 'value2', got '%s'", value)
	}
	value, ok = cache.Get("key1")
	if !ok || value != "value1" {
		t.Errorf("expected to still get 'value1', got '%s'", value)
	}

	// delete should only remove that key
	cache.Delete("key1")
	_, ok = cache.Get("key1")
	if ok {
		t.Error("expected to not find 'key1' after deletion")
	}
	value, ok = cache.Get("key2")
	if !ok || value != "value2" {
		t.Errorf("expected to still get 'value2', got '%s'", value)
	}

	// positive ttl should expire
	cache.Set("key3", "value3", 50*time.Millisecond)
	time.Sleep(100 * time.Millisecond)
	_, ok = cache.Get("key3")
	if ok {
		t.Error("expected 'key3' to expire")
	}
}

func TestRedisCacheNamespaceIsolation(t *testing.T) {
	client := SetupTestRedis(t)
	cacheA := NewRedisCache[string](client, "ns-a", nil)
	cacheB := NewRedisCache[string](client, "ns-b", nil)

	cacheA.Set("key", "value-a", 0)
	cacheB.Set("key", "value-b", 0)

	vA, ok := cacheA.Get("key")
	if !ok || vA != "value-a" {
		t.Errorf("expected 'value-a' from cacheA, got '%s'", vA)
	}

	vB, ok := cacheB.Get("key")
	if !ok || vB != "value-b" {
		t.Errorf("expected 'value-b' from cacheB, got '%s'", vB)
	}
}

func TestRedisInvalidator(t *testing.T) {
	client := SetupTestRedis(t)
	cache := NewRedisCache[string](client, "inv-test", nil)
	invalidator := NewRedisInvalidator(nil, client)

	cache.Set("key1", "value1", 0)
	cache.Set("key2", "value2", 0)

	invalidator.InvalidateNamespace(context.Background(), "inv-test")

	_, ok := cache.Get("key1")
	if ok {
		t.Error("expected 'key1' to be invalidated")
	}
	_, ok = cache.Get("key2")
	if ok {
		t.Error("expected 'key2' to be invalidated")
	}
}
