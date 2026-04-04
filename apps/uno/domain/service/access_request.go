package service

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
)

type AccessRequestService struct {
	accessRequestRepo port.AccessRequestRepo
}

func NewAccessRequestService(accessRequestRepo port.AccessRequestRepo) *AccessRequestService {
	return &AccessRequestService{
		accessRequestRepo: accessRequestRepo,
	}
}

func (ars *AccessRequestService) GetAccessRequests(ctx context.Context) ([]model.AccessRequest, error) {
	return ars.accessRequestRepo.GetAccessRequests(ctx)
}

func (ars *AccessRequestService) CreateAccessRequest(ctx context.Context, ar model.NewAccessRequest) (model.AccessRequest, error) {
	return ars.accessRequestRepo.CreateAccessRequest(ctx, ar)
}

func (ars *AccessRequestService) GetAccessRequestByID(ctx context.Context, id string) (model.AccessRequest, error) {
	return ars.accessRequestRepo.GetAccessRequestByID(ctx, id)
}

func (ars *AccessRequestService) DeleteAccessRequestByID(ctx context.Context, id string) error {
	return ars.accessRequestRepo.DeleteAccessRequestByID(ctx, id)
}
