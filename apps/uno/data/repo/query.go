package repo

import (
	"context"
	"uno/data/model"
)

func (r *Repo) GetAllHappenings(ctx context.Context) (res []model.Happening, err error) {
	query := `
		SELECT
			id, slug, title, type, date, registration_groups,
			registration_start_groups, registration_start, registration_end
		FROM happening
	`
	err = r.db.SelectContext(ctx, &res, query)
	return res, err
}

func (r *Repo) GetHappeningById(ctx context.Context, id string) (hap model.Happening, err error) {
	query := `
		SELECT
			id, slug, title, type, date, registration_groups,
			registration_start_groups, registration_start, registration_end
		FROM happening
		WHERE id = $1
	`
	err = r.db.GetContext(ctx, &hap, query, id)
	return hap, err
}

func (r *Repo) GetSpotRangesByHappeningId(ctx context.Context, hapId string) (ranges []model.SpotRange, err error) {
	query := `
		SELECT
			id, happening_id, spots, min_year, max_year
		FROM spot_range
		WHERE happening_id = $1
	`
	err = r.db.SelectContext(ctx, &ranges, query, hapId)
	return ranges, err
}

func (r *Repo) GetRegistrationsByHappeningId(ctx context.Context, hapId string) (regs []model.Registration, err error) {
	query := `
		SELECT
			user_id, happening_id, status, unregister_reason, created_at, prev_status, changed_at, changed_by
		FROM registration
		WHERE happening_id = $1
	`
	err = r.db.SelectContext(ctx, &regs, query, hapId)
	return regs, err
}

func (r *Repo) GetQuestionsByHappeningId(ctx context.Context, hapId string) (qs []model.Question, err error) {
	query := `
		SELECT
			id, title, required, type, is_sensitive, options, happening_id
		FROM question
		WHERE happening_id = $1
	`
	err = r.db.SelectContext(ctx, &qs, query, hapId)
	return qs, err
}

func (r *Repo) GetUserById(ctx context.Context, id string) (model.User, error) {
	return model.User{}, nil
}

func (r *Repo) GetSessionByToken(ctx context.Context, token string) (model.Session, error) {
	return model.Session{}, nil
}
