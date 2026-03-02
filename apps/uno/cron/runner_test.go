package cron

import (
	"context"
	"log/slog"
	"testing"
	"time"
	"uno/infrastructure/logging"

	"github.com/stretchr/testify/assert"
)

type testJob struct {
	run func(ctx context.Context) error
}

func (j testJob) Run(ctx context.Context) error {
	if j.run == nil {
		return nil
	}
	return j.run(ctx)
}

func TestRunnerStartStop(t *testing.T) {
	base := slog.New(slog.NewTextHandler(testWriter{t: t}, nil))
	logger := logging.New(base)

	runner := New(logger, time.UTC)
	runner.AddSchedule(Schedule{
		Name: "test_job",
		Spec: "* * * * *",
		Job:  testJob{},
	})

	err := runner.Start()
	assert.NoError(t, err)

	ctx, cancel := context.WithTimeout(t.Context(), 2*time.Second)
	defer cancel()

	err = runner.StopWithContext(ctx)
	assert.NoError(t, err)
}

type testWriter struct {
	t *testing.T
}

func (w testWriter) Write(p []byte) (n int, err error) {
	w.t.Log(string(p))
	return len(p), nil
}
