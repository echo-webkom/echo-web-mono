package adventofcode

import "uno/domain/model"

type AdventOfCodeDayResponse struct {
	Stars     int  `json:"stars"`
	Star1Time *int `json:"star1_time"`
	Star2Time *int `json:"star2_time"`
}

type AdventOfCodeMemberResponse struct {
	ID         int                                `json:"id"`
	Name       string                             `json:"name"`
	LocalScore int                                `json:"local_score"`
	Days       map[string]AdventOfCodeDayResponse `json:"days"`
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
