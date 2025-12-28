package services

import "uno/domain/ports"

type AccessRequestService struct {
	accessRequestRepo ports.AccessRequestRepo
}

func NewAccessRequestService(accessRequestRepo ports.AccessRequestRepo) *AccessRequestService {
	return &AccessRequestService{
		accessRequestRepo: accessRequestRepo,
	}
}

func (ars *AccessRequestService) Queries() ports.AccessRequestRepo {
	return ars.accessRequestRepo
}

func (ars *AccessRequestService) AccessRequestRepo() ports.AccessRequestRepo {
	return ars.accessRequestRepo
}
