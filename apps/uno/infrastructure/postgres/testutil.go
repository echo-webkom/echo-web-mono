package postgres

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sync/atomic"
	"testing"
	"time"

	"github.com/testcontainers/testcontainers-go"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
	"github.com/testcontainers/testcontainers-go/wait"
)

var dbCounter atomic.Int64

func SetupTestDB(t *testing.T) *Database {
	t.Helper()
	ctx := context.Background()

	// Disable ryuk for Colima compatibility
	_ = os.Setenv("TESTCONTAINERS_RYUK_DISABLED", "true")

	container, err := postgres.Run(ctx,
		"postgres:17",
		postgres.WithDatabase("postgres"),
		postgres.WithUsername("test"),
		postgres.WithPassword("test"),
		testcontainers.WithReuseByName("uno-postgres-test"),
		testcontainers.WithWaitStrategy(
			wait.ForLog("database system is ready to accept connections").
				WithOccurrence(2).
				WithStartupTimeout(60*time.Second),
		),
	)
	if err != nil {
		t.Fatalf("failed to start postgres container: %v", err)
	}

	port, err := container.MappedPort(ctx, "5432")
	if err != nil {
		t.Fatalf("failed to get mapped port: %v", err)
	}

	// Unique DB name per test, safe across parallel package runs
	dbName := fmt.Sprintf("uno_test_%d_%d", os.Getpid(), dbCounter.Add(1))
	adminConnStr := fmt.Sprintf("postgres://test:test@127.0.0.1:%s/postgres?sslmode=disable", port.Port())

	adminDB, err := New(adminConnStr)
	if err != nil {
		t.Fatalf("failed to connect to admin database: %v", err)
	}
	if _, err = adminDB.ExecContext(ctx, fmt.Sprintf(`CREATE DATABASE %q`, dbName)); err != nil {
		_ = adminDB.Close()
		t.Fatalf("failed to create test database %s: %v", dbName, err)
	}
	_ = adminDB.Close()

	connStr := fmt.Sprintf("postgres://test:test@127.0.0.1:%s/%s?sslmode=disable", port.Port(), dbName)

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
		t.Fatalf("failed to connect to test database after %d retries: %v", maxRetries, err)
	}

	if err := runMigrations(ctx, db); err != nil {
		t.Fatalf("failed to run migrations: %v", err)
	}

	t.Cleanup(func() {
		_ = db.Close()
		adminDB, err := New(adminConnStr)
		if err == nil {
			_, _ = adminDB.ExecContext(context.Background(), fmt.Sprintf(`DROP DATABASE %q WITH (FORCE)`, dbName))
			_ = adminDB.Close()
		}
	})

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
