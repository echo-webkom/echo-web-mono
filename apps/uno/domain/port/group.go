package port

import (
	"context"
	"uno/domain/model"
)

type GroupRepo interface {
	GetGroupByID(ctx context.Context, id string) (model.Group, error)
	CreateGroup(ctx context.Context, group model.NewGroup) (model.Group, error)
	UpdateGroup(ctx context.Context, group model.Group) (model.Group, error)
	DeleteGroup(ctx context.Context, id string) error
}
