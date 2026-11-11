package model

type Trophy struct {
	Title string
	TrophyLevels []TrophyLevel
}

type TrophyLevel struct {
	Image string
	Threshold int
	Name string
	Text string
}

type UserTrophy struct {
	Trophy       Trophy
	Progress     int
	CurrentLevel TrophyLevel
}