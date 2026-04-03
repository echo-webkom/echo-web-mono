package service

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
)

var (
	upcomingUrl = "https://www.profixio.com/app/bergen-innefotball-5-side-futsal-2025-2026/category/1173209/group/3385837?segment=kommende"
	previousUrl = "https://www.profixio.com/app/bergen-innefotball-5-side-futsal-2025-2026/category/1173209/group/3385837?segment=historikk"
	tableUrl    = "https://www.profixio.com/app/bergen-innefotball-5-side-futsal-2025-2026/category/1173209/group/3385837"
)

type DatabrusService struct {
	logger       port.Logger
	databrusRepo port.DatabrusRepo
}

func NewDatabrusService(logger port.Logger, databrusRepo port.DatabrusRepo) *DatabrusService {
	return &DatabrusService{
		logger:       logger,
		databrusRepo: databrusRepo,
	}
}

func (s *DatabrusService) GetMatches(ctx context.Context) ([]model.Match, error) {
	// Get the matches from the repository
	previousMatches, err := s.databrusRepo.GetDatabrusMatches(ctx, previousUrl, model.Previous)
	if err != nil {
		return nil, err
	}
	upcomingMatches, err := s.databrusRepo.GetDatabrusMatches(ctx, upcomingUrl, model.Upcoming)
	if err != nil {
		return nil, err
	}

	// Combine previous and upcoming matches
	matches := append(previousMatches, upcomingMatches...)
	return matches, nil
}

func (s *DatabrusService) GetTable(ctx context.Context) (model.Table, error) {
	table, err := s.databrusRepo.GetDatabrusTable(ctx, tableUrl)
	if err != nil {
		return nil, err
	}

	return table, nil
}
