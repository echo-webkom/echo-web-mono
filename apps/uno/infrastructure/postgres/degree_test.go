package postgres

import (
	"context"
	"testing"
	"uno/domain/model"

	"github.com/stretchr/testify/assert"
)

// Test creating a degree
func TestDegreeRepo_CreateDegree(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewDegreeRepo(db, NewTestLogger())
	ctx := context.Background()

	degree := model.Degree{
		ID:   "DTEK",
		Name: "Datateknologi",
	}

	createdDegree, err := repo.CreateDegree(ctx, degree)

	assert.NoError(t, err)
	assert.Equal(t, degree.ID, createdDegree.ID)
	assert.Equal(t, degree.Name, createdDegree.Name)
}

// Test retrieving all degrees
func TestDegreeRepo_GetAllDegrees(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewDegreeRepo(db, NewTestLogger())
	ctx := context.Background()

	degree1 := model.Degree{ID: "DTEK", Name: "Datateknologi"}
	degree2 := model.Degree{ID: "INF", Name: "Informatikk"}

	_, err := repo.CreateDegree(ctx, degree1)
	assert.NoError(t, err)

	_, err = repo.CreateDegree(ctx, degree2)
	assert.NoError(t, err)

	degrees, err := repo.GetAllDegrees(ctx)

	assert.NoError(t, err)
	assert.Len(t, degrees, 2)

	ids := []string{degrees[0].ID, degrees[1].ID}
	assert.Contains(t, ids, "DTEK")
	assert.Contains(t, ids, "INF")
}

// Test updating a degree
func TestDegreeRepo_UpdateDegree(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewDegreeRepo(db, NewTestLogger())
	ctx := context.Background()

	degree := model.Degree{
		ID:   "DTEK",
		Name: "Datateknologi",
	}

	_, err := repo.CreateDegree(ctx, degree)
	assert.NoError(t, err)

	degree.Name = "Data Technology"
	updatedDegree, err := repo.UpdateDegree(ctx, degree)

	assert.NoError(t, err)
	assert.Equal(t, "DTEK", updatedDegree.ID)
	assert.Equal(t, "Data Technology", updatedDegree.Name)

	degrees, err := repo.GetAllDegrees(ctx)
	assert.NoError(t, err)
	assert.Len(t, degrees, 1)
	assert.Equal(t, "Data Technology", degrees[0].Name)
}

// Test deleting a degree
func TestDegreeRepo_DeleteDegree(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewDegreeRepo(db, NewTestLogger())
	ctx := context.Background()

	degree := model.Degree{
		ID:   "DTEK",
		Name: "Datateknologi",
	}

	_, err := repo.CreateDegree(ctx, degree)
	assert.NoError(t, err)

	err = repo.DeleteDegree(ctx, degree.ID)
	assert.NoError(t, err)

	degrees, err := repo.GetAllDegrees(ctx)
	assert.NoError(t, err)
	assert.Len(t, degrees, 0)
}

// Test deleting a degree that does not exist
func TestDegreeRepo_DeleteNonExistentDegree(t *testing.T) {
	db := SetupTestDB(t)
	defer func() {
		_ = db.Close()
	}()

	repo := NewDegreeRepo(db, NewTestLogger())
	ctx := context.Background()

	err := repo.DeleteDegree(ctx, "IDONTEXIST")
	assert.NoError(t, err)
}
