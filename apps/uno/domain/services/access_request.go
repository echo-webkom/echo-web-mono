package services

import "uno/domain/repo"

type AccessRequestService struct {
	accessRequestRepo repo.AccessRequestRepo
}

func NewAccessRequestService(accessRequestRepo repo.AccessRequestRepo) *AccessRequestService {
	return &AccessRequestService{
		accessRequestRepo: accessRequestRepo,
	}
}

func (ars *AccessRequestService) Queries() repo.AccessRequestRepo {
	return ars.accessRequestRepo
}

func (ars *AccessRequestService) AccessRequestRepo() repo.AccessRequestRepo {
	return ars.accessRequestRepo
}
