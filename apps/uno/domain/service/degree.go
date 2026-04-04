package service

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
)

type DegreeService struct {
	degreeRepo port.DegreeRepo
}

func NewDegreeService(degreeRepo port.DegreeRepo) *DegreeService {
	return &DegreeService{
		degreeRepo: degreeRepo,
	}
}

func (ds *DegreeService) GetAllDegrees(ctx context.Context) ([]model.Degree, error) {
	return ds.degreeRepo.GetAllDegrees(ctx)
}

func (ds *DegreeService) CreateDegree(ctx context.Context, degree model.Degree) (model.Degree, error) {
	return ds.degreeRepo.CreateDegree(ctx, degree)
}

func (ds *DegreeService) UpdateDegree(ctx context.Context, degree model.Degree) (model.Degree, error) {
	return ds.degreeRepo.UpdateDegree(ctx, degree)
}

func (ds *DegreeService) DeleteDegree(ctx context.Context, id string) error {
	return ds.degreeRepo.DeleteDegree(ctx, id)
}
