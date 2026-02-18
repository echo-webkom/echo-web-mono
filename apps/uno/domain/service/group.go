package service

import "uno/domain/port"

type GroupService struct {
	logger    port.Logger
	groupRepo port.GroupRepo
}

func NewGroupService(logger port.Logger, groupRepo port.GroupRepo) *GroupService {
	return &GroupService{
		logger:    logger,
		groupRepo: groupRepo,
	}
}

func (s *GroupService) GroupRepo() port.GroupRepo {
	return s.groupRepo
}
