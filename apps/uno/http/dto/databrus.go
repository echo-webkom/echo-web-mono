package dto

import "uno/domain/model"

type DatabrusMatchDTO struct {
	ID        string  `json:"id"`
	HomeTeam  string  `json:"home_team"`
	AwayTeam  string  `json:"away_team"`
	DateTime  string  `json:"date_time"`
	HomeScore *string `json:"home_score"`
	AwayScore *string `json:"away_score"`
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
	Position       int    `json:"position"`
	Team           string `json:"team"`
	MatchesPlayed  int    `json:"matches_played"`
	Wins           int    `json:"wins"`
	Draws          int    `json:"draws"`
	Losses         int    `json:"losses"`
	GoalsFor       int    `json:"goals_for"`
	GoalsAgainst   int    `json:"goals_against"`
	GoalDifference int    `json:"goal_difference"`
	Points         int    `json:"points"`
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
