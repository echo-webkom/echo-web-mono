package repo

import (
	"context"
	"uno/domain/model"
)

type AccessRequestRepo interface {
	GetAccessRequests(ctx context.Context) ([]model.AccessRequest, error)
	CreateAccessRequest(ctx context.Context, ar model.AccessRequest) (model.AccessRequest, error)
}
