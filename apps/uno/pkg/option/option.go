package option

import (
	"encoding/json"
)

// Option represents a value that may or may not be present.
// IsSome() is false when the field was absent from JSON, true when it was
// explicitly provided (even as null).
type Option[T any] struct {
	value  T
	isSome bool
}

// New creates a new Maybe with the given value. The isSome field is set to true.
func New[T any](value T) Option[T] {
	return Option[T]{value: value, isSome: true}
}

// Value returns the underlying value pointer.
func (n Option[T]) Value() T {
	return n.value
}

// IsSome returns true if the field was provided (even if the value is nil)
func (n Option[T]) IsSome() bool {
	return n.isSome
}

// MarshalJSON implements json.Marshaler.
func (n Option[T]) MarshalJSON() ([]byte, error) {
	if !n.isSome {
		return []byte("null"), nil
	}
	return json.Marshal(n.value)
}

// UnmarshalJSON implements json.Unmarshaler.
func (n *Option[T]) UnmarshalJSON(data []byte) error {
	n.isSome = true
	return json.Unmarshal(data, &n.value)
}
