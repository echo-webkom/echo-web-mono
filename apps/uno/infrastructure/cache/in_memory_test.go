package cache

import (
	"testing"
	"time"
)

func TestInMemoryCache(t *testing.T) {
	cache := NewInMemoryCache[string]()

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
	cache.Set("key3", "value3", 5*time.Millisecond)
	time.Sleep(20 * time.Millisecond)
	_, ok = cache.Get("key3")
	if ok {
		t.Error("expected 'key3' to expire")
	}
}
