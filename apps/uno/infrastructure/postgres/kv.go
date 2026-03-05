package postgres

import (
	"context"
	"fmt"
	"uno/domain/port"
)

type KVRepo struct {
	db     *Database
	logger port.Logger
}

func NewKVRepo(db *Database, logger port.Logger) port.KVRepo {
	return &KVRepo{db: db, logger: logger}
}

func (r *KVRepo) DeleteExpired(ctx context.Context) (int64, error) {
	query := `--sql
		DELETE FROM kv
		WHERE ttl < NOW()
	`

	result, err := r.db.ExecContext(ctx, query)
	if err != nil {
		return 0, fmt.Errorf("kv delete expired: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return 0, fmt.Errorf("kv delete expired rows affected: %w", err)
	}

	return rowsAffected, nil
}
