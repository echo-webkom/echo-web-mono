package postgres

import (
	"context"
	"time"
	"uno/domain/model"
	"uno/domain/repo"

	"github.com/lib/pq"
)

type UserRepo struct {
	db *Database
}

func (u *UserRepo) GetBannedUsers(ctx context.Context) ([]repo.UserWithBanInfo, error) {
	panic("unimplemented")
}

func (u *UserRepo) GetUsersWithStrikes(ctx context.Context) ([]repo.UserWithStrikes, error) {
	panic("unimplemented")
}

func (u *UserRepo) GetUserByID(ctx context.Context, id string) (user model.User, err error) {
	query := `
		SELECT
			id, name, email, image, alternative_email, degree_id, year, type,
			last_sign_in_at, updated_at, created_at, has_read_terms,
			birthday, is_public
		FROM "user"
		WHERE id = $1
	`
	err = u.db.GetContext(ctx, &user, query, id)
	return user, err
}

func (u *UserRepo) GetUsersByIDs(ctx context.Context, ids []string) (users []model.User, err error) {
	query := `
		SELECT
			id, name, email, image, alternative_email, degree_id, year, type,
			last_sign_in_at, updated_at, created_at, has_read_terms,
			birthday, is_public
		FROM "user"
		WHERE id IN ($1)
	`
	err = u.db.SelectContext(ctx, &users, query, pq.Array(ids))
	return users, err
}

func (u *UserRepo) GetUsersWithBirthday(ctx context.Context, date time.Time) (users []model.User, err error) {
	query := `
		SELECT
			id, name, email, image, alternative_email, degree_id, year, type,
			last_sign_in_at, updated_at, created_at, has_read_terms,
			birthday, is_public
		FROM "user"
		WHERE birthday IS NOT NULL
			AND EXTRACT(MONTH FROM birthday) = EXTRACT(MONTH FROM $1::date)
			AND EXTRACT(DAY FROM birthday) = EXTRACT(DAY FROM $1::date)
	`
	err = u.db.SelectContext(ctx, &users, query, date)
	return users, err
}

func NewUserRepo(db *Database) repo.UserRepo {
	return &UserRepo{db: db}
}
