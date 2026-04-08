package postgres

import (
	"context"
	"fmt"
	"os"
	"testing"
	"time"

	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
)

func SetupTestDB(t *testing.T) *Database {
	ctx := context.Background()

	// Disable ryuk for Colima compatibility
	_ = os.Setenv("TESTCONTAINERS_RYUK_DISABLED", "true")

	container, err := postgres.Run(ctx,
		"postgres:17",
		postgres.WithDatabase("uno_test"),
		postgres.WithUsername("test"),
		postgres.WithPassword("test"),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2).
				WithStartupTimeout(60*time.Second),
		),
	)
	if err != nil {
		t.Fatalf("failed to start postgres container: %v", err)
	}

	t.Cleanup(func() {
		if err := container.Terminate(ctx); err != nil {
			t.Logf("failed to terminate container: %v", err)
		}
	})

	host, err := container.Host(ctx)
	if err != nil {
		t.Fatalf("failed to get container host: %v", err)
	}

	port, err := container.MappedPort(ctx, "5432")
	if err != nil {
		t.Fatalf("failed to get mapped port: %v", err)
	}

	connStr := fmt.Sprintf("postgres://test:test@127.0.0.1:%s/uno_test?sslmode=disable", port.Port())

	// Connect to database with retry logic
	var db *Database
	maxRetries := 10
	for i := range maxRetries {
		db, err = New(connStr)
		if err == nil {
			break
		}
		if i < maxRetries-1 {
			time.Sleep(time.Duration(100*(i+1)) * time.Millisecond)
		}
	}
	if err != nil {
		t.Fatalf("failed to connect to database after %d retries (host: %s, port: %s): %v", maxRetries, host, port.Port(), err)
	}

	if err := RunMigrations(db.DB.DB); err != nil {
		t.Fatalf("failed to run migrations: %v", err)
	}

	return db
}
