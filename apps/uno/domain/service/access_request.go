package service

import "uno/domain/port"

type AccessRequestService struct {
	accessRequestRepo port.AccessRequestRepo
}

func NewAccessRequestService(accessRequestRepo port.AccessRequestRepo) *AccessRequestService {
	return &AccessRequestService{
		accessRequestRepo: accessRequestRepo,
	}
}

func (ars *AccessRequestService) Queries() port.AccessRequestRepo {
	return ars.accessRequestRepo
}

func (ars *AccessRequestService) AccessRequestRepo() port.AccessRequestRepo {
	return ars.accessRequestRepo
}
