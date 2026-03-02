package jobs

import (
	"bytes"
	"context"
	"io"
	"net/http"
	"uno/domain/port"
)

const (
	programmerBarStatusURL = "https://programmer.bar/api/status"
)

type CloseProgrammerBarJob struct {
	client *http.Client
	logger port.Logger
	url    string
}

func NewCloseProgrammerBar(client *http.Client, logger port.Logger) *CloseProgrammerBarJob {
	return &CloseProgrammerBarJob{
		client: client,
		logger: logger,
		url:    programmerBarStatusURL,
	}
}

func (j *CloseProgrammerBarJob) Run(ctx context.Context) error {
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, j.url, bytes.NewBufferString(`{"status":0}`))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := j.client.Do(req)
	if err != nil {
		return err
	}
	defer func() {
		if err := resp.Body.Close(); err != nil {
			j.logger.Error(ctx, "failed to close response body", "error", err)
		}
	}()
	_, _ = io.Copy(io.Discard, resp.Body)

	if resp.StatusCode < 200 || resp.StatusCode >= 400 {
		j.logger.Warn(ctx, "unexpected status when closing bar", "status", resp.StatusCode)
	} else {
		j.logger.Info(ctx, "closed bar", "status", resp.StatusCode)
	}
	return nil
}
