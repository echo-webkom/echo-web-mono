package model

type Group struct {
	ID   string `db:"id"`
	Name string `db:"name"`
}

type UsersToGroups struct {
	UserID   string `db:"user_id"`
	GroupID  string `db:"group_id"`
	IsLeader bool   `db:"is_leader"`
}
