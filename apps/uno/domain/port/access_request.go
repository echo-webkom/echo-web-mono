package port

import (
	"context"
	"uno/domain/model"
)

type AccessRequestRepo interface {
	GetAccessRequests(ctx context.Context) ([]model.AccessRequest, error)
	GetAccessRequestByID(ctx context.Context, id string) (model.AccessRequest, error)
	CreateAccessRequest(ctx context.Context, ar model.NewAccessRequest) (model.AccessRequest, error)
	DeleteAccessRequestByID(ctx context.Context, id string) error
}
