package dto

import "uno/domain/model"

type Trophy struct {
	Title        string        `json:"title"`
	TrophyLevels []TrophyLevel `json:"trophyLevels"`
}

type TrophyLevel struct {
	Image     string `json:"image"`
	Threshold int    `json:"threshold"`
	Name      string `json:"name"`
	Text      string `json:"text"`
}

type UserTrophyResponse struct {
	Trophy       Trophy      `json:"trophy"`
	Progress     int         `json:"progress"`
	CurrentLevel TrophyLevel `json:"currentLevel"`
}

func TrophyLevelFromDomain(level model.TrophyLevel) TrophyLevel {
	return TrophyLevel{
		Image:     level.Image,
		Threshold: level.Threshold,
		Name:      level.Name,
		Text:      level.Text,
	}
}

func TrophyFromDomain(trophy model.Trophy) Trophy {
	levels := make([]TrophyLevel, len(trophy.TrophyLevels))
	for i, level := range trophy.TrophyLevels {
		levels[i] = TrophyLevelFromDomain(level)
	}

	return Trophy{
		Title:        trophy.Title,
		TrophyLevels: levels,
	}
}

func UserTrophyFromDomain(trophy model.UserTrophy) UserTrophyResponse {
	return UserTrophyResponse{
		Trophy:       TrophyFromDomain(trophy.Trophy),
		Progress:     trophy.Progress,
		CurrentLevel: TrophyLevelFromDomain(trophy.CurrentLevel),
	}
}

func UserTrophiesFromDomain(trophies []model.UserTrophy) []UserTrophyResponse {
	responses := make([]UserTrophyResponse, len(trophies))
	for i, trophy := range trophies {
		responses[i] = UserTrophyFromDomain(trophy)
	}
	return responses
}
