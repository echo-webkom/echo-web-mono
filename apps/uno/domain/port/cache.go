package port

import "time"

type Cache[T any] interface {
	Get(key string) (T, bool)
	Set(key string, value T, ttl time.Duration)
	Delete(key string)
}
