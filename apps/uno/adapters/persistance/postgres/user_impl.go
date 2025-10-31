package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/repo"
)

type PostgresUserImpl struct {
	db *Database
}

func NewPostgresUserImpl(db *Database) repo.UserRepo {
	return &PostgresUserImpl{db: db}
}

func (u *PostgresUserImpl) GetUserById(ctx context.Context, id string) (model.User, error) {
	return model.User{}, nil
}
