package testutil

import (
	"github.com/brianvoe/gofakeit/v7"
)

func NewFakeStruct[T any](overrides ...func(*T)) T {
	var obj T
	gofakeit.Struct(&obj)

	for _, override := range overrides {
		override(&obj)
	}

	return obj
}
