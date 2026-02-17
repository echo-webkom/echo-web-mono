package adventofcode

import (
	"encoding/json"
	"fmt"
	"net/http"
)

const (
	leaderboardURL    = "https://adventofcode.com/%d/leaderboard/private/view/%s"
	sessionCookieName = "session"
)

var HttpClient = &http.Client{}

type Client struct {
	sessionToken string
}

func New(sessionToken string) *Client {
	return &Client{sessionToken: sessionToken}
}

type Star struct {
	StarIndex int `json:"star_index"`
	GetStarTs int `json:"get_star_ts"`
}

type Member struct {
	Name               string                      `json:"name"`
	ID                 int                         `json:"id"`
	LastStarTs         int                         `json:"last_star_ts"`
	Stars              int                         `json:"stars"`
	LocalScore         int                         `json:"local_score"`
	GlobalScore        int                         `json:"global_score"`
	CompletionDayLevel map[string]map[string]*Star `json:"completion_day_level"`
}

type Leaderboard struct {
	Members map[string]Member `json:"members"`
	OwnerID int               `json:"owner_id"`
	Day1Ts  int               `json:"day1_ts"`
	Event   string            `json:"event"`
}

// GetLeaderboard fetches the leaderboard data for a given year and leaderboard ID.
func (a *Client) GetLeaderboard(year int, leaderboardID string) (Leaderboard, error) {
	req, err := http.NewRequest("GET", fmt.Sprintf(leaderboardURL, year, leaderboardID), nil)
	if err != nil {
		return Leaderboard{}, err
	}
	req.AddCookie(&http.Cookie{Name: sessionCookieName, Value: a.sessionToken})
	req.Header.Set("User-Agent", "echo-yr-client/1.0 (+https://echo.uib.no/)")
	req.Header.Set("Accept", "application/json")

	resp, err := HttpClient.Do(req)
	if err != nil {
		return Leaderboard{}, err
	}
	defer func() {
		_ = resp.Body.Close()
	}()

	if resp.StatusCode != http.StatusOK {
		return Leaderboard{}, fmt.Errorf("failed to fetch leaderboard: status code %d", resp.StatusCode)
	}

	var leaderboard Leaderboard
	err = json.NewDecoder(resp.Body).Decode(&leaderboard)
	if err != nil {
		return Leaderboard{}, err
	}

	return leaderboard, nil

}
