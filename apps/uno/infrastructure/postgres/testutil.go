package postgres

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"os"
	"path/filepath"
	"testing"
	"time"
	"uno/domain/ports"

	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
)

// NoOpLogger is a no-op logger implementation for tests
type NoOpLogger struct{}

func (n *NoOpLogger) Debug(ctx context.Context, msg string, args ...any) {}
func (n *NoOpLogger) Info(ctx context.Context, msg string, args ...any)  {}
func (n *NoOpLogger) Warn(ctx context.Context, msg string, args ...any)  {}
func (n *NoOpLogger) Error(ctx context.Context, msg string, args ...any) {}
func (n *NoOpLogger) With(args ...any) ports.Logger                      { return n }
func (n *NoOpLogger) Slog() *slog.Logger                                 { return slog.Default() }

// NewTestLogger returns a no-op logger for tests
func NewTestLogger() ports.Logger {
	return &NoOpLogger{}
}

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

	connStr := fmt.Sprintf("postgres://test:test@127.0.0.1:%s/uno_test", port.Port())

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

	if err := runMigrations(ctx, db); err != nil {
		t.Fatalf("failed to run migrations: %v", err)
	}

	return db
}

func runMigrations(ctx context.Context, db *Database) error {
	dir, err := os.Getwd()
	if err != nil {
		return fmt.Errorf("failed to get current working directory: %w", err)
	}

	var migrationsPath string

	// Walk up the directories to find the migrations folder
	for range 10 {
		migrationsFolder := filepath.Join(dir, "packages/db/drizzle/migrations")
		if _, err := os.Stat(migrationsFolder); err == nil {
			migrationsPath = migrationsFolder
			break
		}

		// Move up one directory
		parent := filepath.Dir(dir)
		if parent == dir {
			log.Fatalln("reached root of file system")
			break
		}
		dir = parent
	}

	if migrationsPath == "" {
		return fmt.Errorf("could not find migrations folder")
	}

	files, err := os.ReadDir(migrationsPath)
	if err != nil {
		return fmt.Errorf("failed to read migrations directory: %w", err)
	}

	for _, file := range files {
		if file.IsDir() || filepath.Ext(file.Name()) != ".sql" {
			continue
		}

		path := filepath.Join(migrationsPath, file.Name())
		content, err := os.ReadFile(path)
		if err != nil {
			return fmt.Errorf("failed to read migration file %s: %w", file.Name(), err)
		}

		if _, err := db.ExecContext(ctx, string(content)); err != nil {
			return fmt.Errorf("failed to execute migration %s: %w", file.Name(), err)
		}
	}

	return nil
}
