package ports

import (
	"context"
	"uno/domain/model"
)

type DegreeRepo interface {
	GetAllDegrees(ctx context.Context) ([]model.Degree, error)
	CreateDegree(ctx context.Context, degree model.Degree) (model.Degree, error)
	UpdateDegree(ctx context.Context, degree model.Degree) (model.Degree, error)
	DeleteDegree(ctx context.Context, id string) error
}
