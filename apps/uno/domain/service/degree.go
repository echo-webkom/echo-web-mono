package service

import "uno/domain/port"

type DegreeService struct {
	degreeRepo port.DegreeRepo
}

func NewDegreeService(degreeRepo port.DegreeRepo) *DegreeService {
	return &DegreeService{
		degreeRepo: degreeRepo,
	}
}

func (ds *DegreeService) DegreeRepo() port.DegreeRepo {
	return ds.degreeRepo
}
