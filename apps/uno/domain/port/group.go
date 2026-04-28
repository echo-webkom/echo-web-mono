package port

import (
	"context"
	"uno/domain/model"
)

type GroupRepo interface {
	GetAllGroups(ctx context.Context) ([]model.Group, error)
	GetGroupByID(ctx context.Context, id string) (model.Group, error)
	GetGroupMembers(ctx context.Context, groupID string) ([]model.GroupMember, error)
	GetUserGroupMembership(ctx context.Context, groupID string, userID string) (*model.UsersToGroups, error)
	CreateGroup(ctx context.Context, group model.NewGroup) (model.Group, error)
	UpdateGroup(ctx context.Context, group model.Group) (model.Group, error)
	DeleteGroup(ctx context.Context, id string) error
	SetGroupMemberLeader(ctx context.Context, groupID string, userID string, isLeader bool) error
	AddUserToGroup(ctx context.Context, groupID string, userID string) error
	RemoveUserFromGroup(ctx context.Context, groupID string, userID string) error
	RemoveAllUserMemberships(ctx context.Context, userID string) error
}
