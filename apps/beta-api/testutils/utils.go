package testutils

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/stretchr/testify/assert"
	"github.com/testcontainers/testcontainers-go/modules/postgres"
)

// Convert a directory of SQL files into a temporary directory with the
// expected structure for golang-migrate. Basically it expects files
// with .up and .down, but we only have forward migrations.
func prepareMigrations(srcDir string) (string, error) {
	tmpDir, err := os.MkdirTemp("", "migrations")
	if err != nil {
		return "", err
	}
	entries, err := os.ReadDir(srcDir)
	if err != nil {
		return "", err
	}
	for _, e := range entries {
		if filepath.Ext(e.Name()) != ".sql" {
			continue
		}
		base := strings.TrimSuffix(e.Name(), ".sql")
		data, err := os.ReadFile(filepath.Join(srcDir, e.Name()))
		if err != nil {
			return "", err
		}
		upPath := filepath.Join(tmpDir, base+".up.sql")
		if err := os.WriteFile(upPath, data, 0o644); err != nil {
			return "", err
		}
		downPath := filepath.Join(tmpDir, base+".down.sql")
		stub := []byte("-- no down migration\n")
		if err := os.WriteFile(downPath, stub, 0o644); err != nil {
			return "", err
		}
	}
	return tmpDir, nil
}

// Get the path to the migrations directory.
func getMigrationDir() (string, error) {
	_, b, _, ok := runtime.Caller(0)
	if !ok {
		return "", fmt.Errorf("unable to get caller info")
	}

	basePath := filepath.Join(filepath.Dir(b), "../../../packages/db/drizzle/migrations")
	absPath, err := filepath.Abs(basePath)
	if err != nil {
		return "", err
	}

	return absPath, nil
}

// Create a test database with migrations applied.
func CreateTestDatabase(ctx context.Context, t *testing.T) *pgxpool.Pool {
	t.Helper()

	pgContainer, err := postgres.Run(ctx, "postgres:15.3-alpine",
		postgres.BasicWaitStrategies(),
	)
	if err != nil {
		t.Fatal(err)
	}

	t.Cleanup(func() {
		if err := pgContainer.Terminate(ctx); err != nil {
			t.Fatalf("failed to terminate pgContainer: %s", err)
		}
	})

	connStr, err := pgContainer.ConnectionString(ctx, "sslmode=disable")
	assert.NoError(t, err)

	pgxpool, err := pgxpool.New(ctx, connStr)

	dirPath, err := getMigrationDir()
	if err != nil {
		t.Fatal(err)
	}

	migDir, err := prepareMigrations(dirPath)
	if err != nil {
		t.Fatal(err)
	}
	m, err := migrate.New(
		"file://"+migDir,
		connStr,
	)
	if err != nil {
		t.Fatal(err)
	}
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		t.Fatalf("failed to run migrations: %s", err)
	}

	return pgxpool
}
