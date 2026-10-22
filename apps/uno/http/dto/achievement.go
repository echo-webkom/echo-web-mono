package dto

import "uno/domain/model"

type AchievementResponse struct {
	BedpresCount int `json:"bedpresCount"`
}

func FromDomain(a model.Achievement) AchievementResponse {
	return AchievementResponse{
		BedpresCount: a.BedpresCount,
	}
}