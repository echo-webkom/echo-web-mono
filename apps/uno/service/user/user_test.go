package user_test

import (
	"context"
	"testing"

	"github.com/echo-webkom/uno/service/user"
	"github.com/echo-webkom/uno/testutils"
	"github.com/stretchr/testify/assert"
)

func TestUserService(t *testing.T) {
	t.Run("should not find user by ID", func(t *testing.T) {
		ctx := context.Background()
		pgxpool := testutils.CreateTestDatabase(ctx, t)
		us := user.New(pgxpool)

		user, err := us.FindUserByFeideID(ctx, "foobar")

		assert.Error(t, err)
		assert.Empty(t, user.ID)
	})

	t.Run("should find user by ID", func(t *testing.T) {
		ctx := context.Background()
		pgxpool := testutils.CreateTestDatabase(ctx, t)
		us := user.New(pgxpool)

		us.Create(ctx, "foobar", "Bo Salhus", "bo.salhus@echo.uib.no")
		user, err := us.FindByID(ctx, "foobar")

		assert.NoError(t, err)
		assert.Equal(t, "foobar", user.ID)
		assert.Equal(t, "Bo Salhus", *user.Name)
	})
}
