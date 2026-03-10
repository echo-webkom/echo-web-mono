package dto

import "uno/domain/model"

type DatabrusMatchDTO struct {
	ID        string  `json:"id" validate:"required"`
	HomeTeam  string  `json:"home_team" validate:"required"`
	AwayTeam  string  `json:"away_team" validate:"required"`
	DateTime  string  `json:"date_time" validate:"required"`
	HomeScore *string `json:"home_score" validate:"required"`
	AwayScore *string `json:"away_score" validate:"required"`
}

type DatabrusMatchReponse []DatabrusMatchDTO

func DatabrusMatchesFromDomain(matches []model.Match) DatabrusMatchReponse {
	response := make(DatabrusMatchReponse, len(matches))
	for i, m := range matches {
		response[i] = DatabrusMatchDTO{
			ID:        m.ID,
			HomeTeam:  m.HomeTeam,
			AwayTeam:  m.AwayTeam,
			DateTime:  m.DateTime,
			HomeScore: m.HomeScore,
			AwayScore: m.AwayScore,
		}
	}
	return response
}

type DatabrusTableRow struct {
	Position       int    `json:"position" validate:"required"`
	Team           string `json:"team" validate:"required"`
	MatchesPlayed  int    `json:"matches_played" validate:"required"`
	Wins           int    `json:"wins" validate:"required"`
	Draws          int    `json:"draws" validate:"required"`
	Losses         int    `json:"losses" validate:"required"`
	GoalsFor       int    `json:"goals_for" validate:"required"`
	GoalsAgainst   int    `json:"goals_against" validate:"required"`
	GoalDifference int    `json:"goal_difference" validate:"required"`
	Points         int    `json:"points" validate:"required"`
}

type DatabrusTableResponse []DatabrusTableRow

func DatabrusTableFromDomain(table model.Table) DatabrusTableResponse {
	response := make(DatabrusTableResponse, len(table))
	for i, row := range table {
		response[i] = DatabrusTableRow{
			Position:       row.Position,
			Team:           row.Team,
			MatchesPlayed:  row.MatchesPlayed,
			Wins:           row.Wins,
			Draws:          row.Draws,
			Losses:         row.Losses,
			GoalsFor:       row.GoalsFor,
			GoalsAgainst:   row.GoalsAgainst,
			GoalDifference: row.GoalDifference,
			Points:         row.Points,
		}
	}
	return response
}
