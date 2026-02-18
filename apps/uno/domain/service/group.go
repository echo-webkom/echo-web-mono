package service

import "uno/domain/port"

type GroupService struct {
	groupRepo port.GroupRepo
}

func NewGroupService(groupRepo port.GroupRepo) *GroupService {
	return &GroupService{
		groupRepo: groupRepo,
	}
}

func (s *GroupService) GroupRepo() port.GroupRepo {
	return s.groupRepo
}
