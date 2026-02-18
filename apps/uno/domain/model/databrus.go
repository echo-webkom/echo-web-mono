package model

type MatchType string

const (
	Upcoming MatchType = "upcoming"
	Previous MatchType = "previous"
)

type Match struct {
	Type      MatchType
	ID        string
	HomeTeam  string
	AwayTeam  string
	DateTime  string
	HomeScore *string
	AwayScore *string
}

type TableRow struct {
	Position       int
	Team           string
	MatchesPlayed  int
	Wins           int
	Draws          int
	Losses         int
	GoalsFor       int
	GoalsAgainst   int
	GoalDifference int
	Points         int
}

type Table []TableRow
