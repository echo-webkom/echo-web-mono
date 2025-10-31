package model

type Group struct {
	ID   string `db:"id" json:"id"`
	Name string `db:"name" json:"name"`
}

type UsersToGroups struct {
	UserID   string `db:"user_id" json:"user_id"`
	GroupID  string `db:"group_id" json:"group_id"`
	IsLeader bool   `db:"is_leader" json:"is_leader"`
}
