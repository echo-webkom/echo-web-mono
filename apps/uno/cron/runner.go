package cron

import (
	"context"
	"fmt"
	"sync"
	"time"
	"uno/domain/port"

	gocron "github.com/robfig/cron/v3"
)

type Job interface {
	Run(ctx context.Context) error
}

type Schedule struct {
	Name string
	Spec string
	Job  Job
}

type Runner struct {
	logger    port.Logger
	cron      *gocron.Cron
	schedules []Schedule
	mu        sync.Mutex
	started   bool
}

func New(logger port.Logger, location *time.Location) *Runner {
	cronLogger := &loggerAdapter{logger: logger.With("component", "cron")}
	return &Runner{
		logger: logger,
		cron: gocron.New(
			gocron.WithLocation(location),
			gocron.WithChain(
				gocron.Recover(cronLogger),
				gocron.SkipIfStillRunning(cronLogger),
			),
		),
	}
}

func (r *Runner) AddSchedule(s Schedule) {
	r.schedules = append(r.schedules, s)
}

func (r *Runner) Start() error {
	r.mu.Lock()
	defer r.mu.Unlock()

	if r.started {
		return nil
	}

	for _, schedule := range r.schedules {
		scheduleLogger := r.logger.With("job", schedule.Name, "spec", schedule.Spec)
		job := scheduledJob{name: schedule.Name, logger: scheduleLogger, job: schedule.Job}

		if _, err := r.cron.AddJob(schedule.Spec, job); err != nil {
			return fmt.Errorf("add cron job %s: %w", schedule.Name, err)
		}
		scheduleLogger.Info(context.Background(), "scheduled cron job")
	}

	r.cron.Start()
	r.started = true
	r.logger.Info(context.Background(), "cron runner started", "jobs", len(r.schedules))
	return nil
}

func (r *Runner) Stop() {
	if err := r.StopWithContext(context.Background()); err != nil {
		r.logger.Error(context.Background(), "failed to stop cron runner", "error", err)
	}
}

func (r *Runner) StopWithContext(ctx context.Context) error {
	r.mu.Lock()
	if !r.started {
		r.mu.Unlock()
		return nil
	}
	stopCtx := r.cron.Stop()
	r.started = false
	r.mu.Unlock()

	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-stopCtx.Done():
		return nil
	}
}

type scheduledJob struct {
	name   string
	logger port.Logger
	job    Job
}

func (j scheduledJob) Run() {
	ctx := context.Background()
	start := time.Now()

	j.logger.Info(ctx, "cron job started", "name", j.name)
	if err := j.job.Run(ctx); err != nil {
		j.logger.Error(ctx, "cron job failed", "name", j.name, "duration", time.Since(start), "error", err)
		return
	}
	j.logger.Info(ctx, "cron job completed", "name", j.name, "duration", time.Since(start))
}

type loggerAdapter struct {
	logger port.Logger
}

func (l *loggerAdapter) Info(msg string, keysAndValues ...any) {
	args := make([]any, 0, len(keysAndValues))
	args = append(args, keysAndValues...)
	l.logger.Info(context.Background(), msg, args...)
}

func (l *loggerAdapter) Error(err error, msg string, keysAndValues ...any) {
	args := make([]any, 0, len(keysAndValues)+2)
	args = append(args, keysAndValues...)
	args = append(args, "error", err)
	l.logger.Error(context.Background(), msg, args...)
}
