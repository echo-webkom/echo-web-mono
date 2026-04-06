package ptr

// Of creates a pointer to the given value.
func Of[T any](v T) *T {
	return &v
}
