package user

import (
	"context"

	"github.com/echo-webkom/axis/service/account"
	"github.com/echo-webkom/axis/storage/database"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserService struct {
	pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *UserService {
	return &UserService{
		pool: pool,
	}
}

// Finds the user associated with the given feide ID.
func (s *UserService) FindUserByFeideID(ctx context.Context, feideID string) (database.User, error) {
	as := account.New(s.pool)

	account, err := as.FindAccountByProvider(ctx, "feide", feideID)
	if err != nil {
		return database.User{}, err
	}

	query := `--sql
		SELECT id, name, email, image, alternative_email, degree_id, year, birthday
		FROM "user"
		WHERE id = $1
	`

	var user database.User
	err = s.pool.QueryRow(ctx, query, account.UserID).Scan(
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

// Finds a user by their ID.
func (s *UserService) FindByID(ctx context.Context, ID string) (database.User, error) {
	query := `--sql
		SELECT id, name, email, image, alternative_email, degree_id, year, birthday
		FROM "user"
		WHERE id = $1
	`

	var user database.User
	err := s.pool.QueryRow(ctx, query, ID).Scan(
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

// Creates a new user in the database.
func (s *UserService) Create(ctx context.Context, id, name, email string) error {
	_, err := s.pool.Exec(ctx, `--sql
		INSERT INTO "user" (id, name, email)
		VALUES ($1, $2, $3)
	`, id, name, email)

	return err
}
