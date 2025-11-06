package postgres

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestPostgresSessionImpl_GetSessionByToken(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewSessionRepo(db, NewTestLogger())
	ctx := context.Background()

	session, err := repo.GetSessionByToken(ctx, "some-token")

	assert.NoError(t, err)
	assert.Empty(t, session.SessionToken)
	assert.Empty(t, session.UserID)
}
