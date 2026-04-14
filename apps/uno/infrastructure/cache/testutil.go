package cache

import (
	"context"
	"os"
	"testing"

	"github.com/redis/go-redis/v9"
	redistc "github.com/testcontainers/testcontainers-go/modules/redis"

	"github.com/testcontainers/testcontainers-go"
)

func SetupTestRedis(t *testing.T) *redis.Client {
	t.Helper()

	// Disable ryuk for Colima compatibility
	_ = os.Setenv("TESTCONTAINERS_RYUK_DISABLED", "true")

	ctx := context.Background()
	container, err := redistc.Run(ctx, "redis:7-alpine",
		testcontainers.WithReuseByName("uno-redis-test"),
	)
	if err != nil {
		t.Fatalf("failed to start redis container: %v", err)
	}

	connStr, err := container.ConnectionString(ctx)
	if err != nil {
		t.Fatalf("failed to get redis connection string: %v", err)
	}

	opt, err := redis.ParseURL(connStr)
	if err != nil {
		t.Fatalf("failed to parse redis url: %v", err)
	}

	client := redis.NewClient(opt)
	t.Cleanup(func() {
		_ = client.FlushAll(ctx)
		_ = client.Close()
	})

	return client
}
