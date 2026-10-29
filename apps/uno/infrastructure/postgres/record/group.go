package record

import (
	"time"
	"uno/domain/model"
)

// GroupDB represents the database schema for group table
type GroupDB struct {
	ID       string `db:"id"`
	Name     string `db:"name"`
	IsLeader bool   `db:"is_leader"`
}

// ToDomain converts database model to domain model
func (db *GroupDB) ToDomain() *model.Group {
	return &model.Group{
		ID:       db.ID,
		Name:     db.Name,
		IsLeader: db.IsLeader,
	}
}

type IntgroupRequestDB struct {
	ID                  string    `db:"id"`
	GroupName           string    `db:"group_name"`
	Description         string    `db:"description"`
	InterestedPeople    string    `db:"interested_people"`
	Purpose             string    `db:"purpose"`
	NeedsFromHovedstyre *string   `db:"needs_from_hovedstyre"`
	ContactEmail        string    `db:"contact_email"`
	CreatedAt           time.Time `db:"created_at"`
}

func (db *IntgroupRequestDB) ToDomain() model.IntgroupRequest {
	return model.IntgroupRequest{
		ID:                  db.ID,
		GroupName:           db.GroupName,
		Description:         db.Description,
		InterestedPeople:    db.InterestedPeople,
		Purpose:             db.Purpose,
		NeedsFromHovedstyre: db.NeedsFromHovedstyre,
		ContactEmail:        db.ContactEmail,
		CreatedAt:           db.CreatedAt,
	}
}

func IntgroupRequestsToDomainList(dbModels []IntgroupRequestDB) []model.IntgroupRequest {
	requests := make([]model.IntgroupRequest, len(dbModels))
	for i, dbModel := range dbModels {
		requests[i] = dbModel.ToDomain()
	}
	return requests
}
