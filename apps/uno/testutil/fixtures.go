package testutil

import (
	"context"
	"log/slog"
	"uno/domain/port"

	"github.com/brianvoe/gofakeit/v7"
)

const (
	FakeApiURL = "http://test"
)

func NewFakeStruct[T any](overrides ...func(*T)) T {
	var obj T
	_ = gofakeit.Struct(&obj)

	for _, override := range overrides {
		override(&obj)
	}

	return obj
}

type NoOpLogger struct{}

func NewTestLogger() port.Logger {
	return &NoOpLogger{}
}

func (n *NoOpLogger) Debug(ctx context.Context, msg string, args ...any) {}
func (n *NoOpLogger) Info(ctx context.Context, msg string, args ...any)  {}
func (n *NoOpLogger) Warn(ctx context.Context, msg string, args ...any)  {}
func (n *NoOpLogger) Error(ctx context.Context, msg string, args ...any) {}
func (n *NoOpLogger) With(args ...any) port.Logger                       { return n }
func (n *NoOpLogger) Slog() *slog.Logger                                 { return slog.Default() }
