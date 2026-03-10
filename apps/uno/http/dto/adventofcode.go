package dto

import "uno/domain/model"

type AdventOfCodeDayResponse struct {
	Stars     int  `json:"stars" validate:"required"`
	Star1Time *int `json:"star1_time" validate:"required"`
	Star2Time *int `json:"star2_time" validate:"required"`
}

type AdventOfCodeMemberResponse struct {
	ID         int                                `json:"id" validate:"required"`
	Name       string                             `json:"name" validate:"required"`
	LocalScore int                                `json:"local_score" validate:"required"`
	Days       map[string]AdventOfCodeDayResponse `json:"days" validate:"required"`
}

func AdventOfCodeLeaderboardFromDomain(domain model.AdventOfCodeLeaderboard) []AdventOfCodeMemberResponse {
	leaderboard := make([]AdventOfCodeMemberResponse, 0, len(domain))
	for _, member := range domain {
		days := make(map[string]AdventOfCodeDayResponse)
		for day, dayInfo := range member.Days {
			days[day] = AdventOfCodeDayResponse{
				Stars:     dayInfo.Stars,
				Star1Time: dayInfo.Star1Time,
				Star2Time: dayInfo.Star2Time,
			}
		}

		leaderboard = append(leaderboard, AdventOfCodeMemberResponse{
			ID:         member.ID,
			Name:       member.Name,
			LocalScore: member.LocalScore,
			Days:       days,
		})
	}

	return leaderboard
}
