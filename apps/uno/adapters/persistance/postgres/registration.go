package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type RegistrationRepo struct {
	db *Database
}

func (r *RegistrationRepo) GetRegistrationsByHappeningId(ctx context.Context, hapId string) (regs []model.Registration, err error) {
	query := `
		SELECT
			user_id, happening_id, status, unregister_reason, created_at, prev_status, changed_at, changed_by
		FROM registration
		WHERE happening_id = $1
	`
	err = r.db.SelectContext(ctx, &regs, query, hapId)
	return regs, err
}

func NewRegistrationRepo(db *Database) repo.RegistrationRepo {
	return &RegistrationRepo{db: db}
}
