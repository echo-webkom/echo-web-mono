package cache

import (
	"context"
	"os"
	"testing"

	"github.com/redis/go-redis/v9"
	redistc "github.com/testcontainers/testcontainers-go/modules/redis"
)

func SetupTestRedis(t *testing.T) *redis.Client {
	t.Helper()

	// Disable ryuk for Colima compatibility
	_ = os.Setenv("TESTCONTAINERS_RYUK_DISABLED", "true")

	ctx := context.Background()
	container, err := redistc.Run(ctx, "redis:7-alpine")
	if err != nil {
		t.Fatalf("failed to start redis container: %v", err)
	}
	t.Cleanup(func() { _ = container.Terminate(ctx) })

	connStr, err := container.ConnectionString(ctx)
	if err != nil {
		t.Fatalf("failed to get redis connection string: %v", err)
	}

	opt, err := redis.ParseURL(connStr)
	if err != nil {
		t.Fatalf("failed to parse redis url: %v", err)
	}

	return redis.NewClient(opt)
}
