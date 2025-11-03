package services

import (
	"uno/domain/ports"
)

type DegreeService struct {
	degreeRepo ports.DegreeRepo
}

func NewDegreeService(degreeRepo ports.DegreeRepo) *DegreeService {
	return &DegreeService{
		degreeRepo: degreeRepo,
	}
}

func (ds *DegreeService) DegreeRepo() ports.DegreeRepo {
	return ds.degreeRepo
}
