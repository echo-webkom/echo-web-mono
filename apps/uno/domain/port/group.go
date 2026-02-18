package port

import (
	"context"
	"uno/domain/model"
)

type GroupRepo interface {
	CreateGroup(ctx context.Context, group model.NewGroup) (model.Group, error)
	UpdateGroup(ctx context.Context, group model.Group) (model.Group, error)
	DeleteGroup(ctx context.Context, id string) error
}
