package model

type AdventOfCodeDay struct {
	// Day number stars that day 0, 1 or 2
	Stars int
	// Time when the first star was earned (Unix timestamp)
	Star1Time *int // Time when the first star was earned (Unix timestamp)
	// Time when the second star was earned (Unix timestamp)
	Star2Time *int
}

type AdventOfCodeMember struct {
	ID         int
	Name       string
	LocalScore int
	Days       map[string]AdventOfCodeDay
}

type AdventOfCodeLeaderboard []AdventOfCodeMember
