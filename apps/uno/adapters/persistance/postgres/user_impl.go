package postgres

import (
	"context"
	"time"
	"uno/domain/model"
	"uno/domain/repo"

	"github.com/lib/pq"
)

type PostgresUserImpl struct {
	db *Database
}

func NewPostgresUserImpl(db *Database) repo.UserRepo {
	return &PostgresUserImpl{db: db}
}

func (u *PostgresUserImpl) GetUserByID(ctx context.Context, id string) (user model.User, err error) {
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

func (u *PostgresUserImpl) GetUsersByIDs(ctx context.Context, ids []string) (users []model.User, err error) {
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

func (u *PostgresUserImpl) GetUsersWithBirthday(ctx context.Context, date time.Time) (users []model.User, err error) {
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
