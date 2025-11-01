package services

import (
	"uno/domain/repo"
)

type DegreeService struct {
	degreeRepo repo.DegreeRepo
}

func NewDegreeService(degreeRepo repo.DegreeRepo) *DegreeService {
	return &DegreeService{
		degreeRepo: degreeRepo,
	}
}

func (ds *DegreeService) Queries() repo.DegreeRepo {
	return ds.degreeRepo
}
