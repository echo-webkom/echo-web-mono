package user

import (
	"context"

	"github.com/echo-webkom/axis/apps/account"
	"github.com/echo-webkom/axis/storage/database"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserService struct {
	pool *pgxpool.Pool
}

// Finds the user associated with the given feide ID.
func (s *UserService) FindUserByFeideID(ctx context.Context, feideID string) (database.User, error) {
	as := account.New(s.pool)

	account, err := as.FindAccountByProvider(ctx, "feide", feideID)
	if err != nil {
		return database.User{}, err
	}

	var user database.User
	err = s.pool.QueryRow(ctx, `
		SELECT id, name, email, image, alternative_email, degree_id, year, birthday
		FROM "user"
		WHERE id = $1
	`, account.UserID).Scan(
		&user.ID,
		&user.Name,
		&user.Email,
		&user.AlternativeEmail,
		&user.Image,
		&user.DegreeID,
		&user.Year,
		&user.Birthday,
	)
	if err != nil {
		return database.User{}, err
	}

	return user, nil
}
