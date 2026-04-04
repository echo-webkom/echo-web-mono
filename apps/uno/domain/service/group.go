package service

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
)

type GroupService struct {
	groupRepo port.GroupRepo
}

func NewGroupService(groupRepo port.GroupRepo) *GroupService {
	return &GroupService{
		groupRepo: groupRepo,
	}
}

func (s *GroupService) GetAllGroups(ctx context.Context) ([]model.Group, error) {
	return s.groupRepo.GetAllGroups(ctx)
}

func (s *GroupService) GetGroupByID(ctx context.Context, id string) (model.Group, error) {
	return s.groupRepo.GetGroupByID(ctx, id)
}

func (s *GroupService) GetGroupMembers(ctx context.Context, groupID string) ([]model.GroupMember, error) {
	return s.groupRepo.GetGroupMembers(ctx, groupID)
}

func (s *GroupService) GetUserGroupMembership(ctx context.Context, groupID string, userID string) (*model.UsersToGroups, error) {
	return s.groupRepo.GetUserGroupMembership(ctx, groupID, userID)
}

func (s *GroupService) CreateGroup(ctx context.Context, group model.NewGroup) (model.Group, error) {
	return s.groupRepo.CreateGroup(ctx, group)
}

func (s *GroupService) UpdateGroup(ctx context.Context, group model.Group) (model.Group, error) {
	return s.groupRepo.UpdateGroup(ctx, group)
}

func (s *GroupService) DeleteGroup(ctx context.Context, id string) error {
	return s.groupRepo.DeleteGroup(ctx, id)
}

func (s *GroupService) SetGroupMemberLeader(ctx context.Context, groupID string, userID string, isLeader bool) error {
	return s.groupRepo.SetGroupMemberLeader(ctx, groupID, userID, isLeader)
}

func (s *GroupService) AddUserToGroup(ctx context.Context, groupID string, userID string) error {
	return s.groupRepo.AddUserToGroup(ctx, groupID, userID)
}

func (s *GroupService) RemoveUserFromGroup(ctx context.Context, groupID string, userID string) error {
	return s.groupRepo.RemoveUserFromGroup(ctx, groupID, userID)
}
