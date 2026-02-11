package port

import (
	"context"
	"uno/domain/model"
)

type AccessRequestRepo interface {
	GetAccessRequests(ctx context.Context) ([]model.AccessRequest, error)
	CreateAccessRequest(ctx context.Context, ar model.NewAccessRequest) (model.AccessRequest, error)
}
