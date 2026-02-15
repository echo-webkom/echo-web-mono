package record

import (
	"encoding/json"
	"time"
	"uno/domain/model"
)

type Happening struct {
	ID                      string           `db:"id"`
	Slug                    string           `db:"slug"`
	Title                   string           `db:"title"`
	Type                    string           `db:"type"`
	Date                    *time.Time       `db:"date"`
	RegistrationGroups      *json.RawMessage `db:"registration_groups"`
	RegistrationStartGroups *time.Time       `db:"registration_start_groups"`
	RegistrationStart       *time.Time       `db:"registration_start"`
	RegistrationEnd         *time.Time       `db:"registration_end"`
}

func (h Happening) ToDomain() model.Happening {
	return model.Happening{
		ID:                      h.ID,
		Slug:                    h.Slug,
		Title:                   h.Title,
		Type:                    h.Type,
		Date:                    h.Date,
		RegistrationGroups:      h.RegistrationGroups,
		RegistrationStartGroups: h.RegistrationStartGroups,
		RegistrationStart:       h.RegistrationStart,
		RegistrationEnd:         h.RegistrationEnd,
	}
}

func HappeningsToDomainList(happenings []Happening) []model.Happening {
	domainHappenings := make([]model.Happening, len(happenings))
	for i, h := range happenings {
		domainHappenings[i] = h.ToDomain()
	}
	return domainHappenings
}

type SpotRange struct {
	ID          string `db:"id"`
	HappeningID string `db:"happening_id"`
	Spots       int    `db:"spots"`
	MinYear     int    `db:"min_year"`
	MaxYear     int    `db:"max_year"`
}

func (sr SpotRange) ToDomain() model.SpotRange {
	return model.SpotRange{
		ID:          sr.ID,
		HappeningID: sr.HappeningID,
		Spots:       sr.Spots,
		MinYear:     sr.MinYear,
		MaxYear:     sr.MaxYear,
	}
}

func SpotRangesToDomainList(ranges []SpotRange) []model.SpotRange {
	domainRanges := make([]model.SpotRange, len(ranges))
	for i, r := range ranges {
		domainRanges[i] = r.ToDomain()
	}
	return domainRanges
}

type Question struct {
	ID          string           `db:"id"`
	Title       string           `db:"title"`
	Required    bool             `db:"required"`
	Type        string           `db:"type"`
	IsSensitive bool             `db:"is_sensitive"`
	Options     *json.RawMessage `db:"options"`
	HappeningID string           `db:"happening_id"`
}

func (q Question) ToDomain() model.Question {
	return model.Question{
		ID:          q.ID,
		Title:       q.Title,
		Required:    q.Required,
		Type:        q.Type,
		IsSensitive: q.IsSensitive,
		Options:     q.Options,
		HappeningID: q.HappeningID,
	}
}

func QuestionsToDomainList(questions []Question) []model.Question {
	domainQuestions := make([]model.Question, len(questions))
	for i, q := range questions {
		domainQuestions[i] = q.ToDomain()
	}
	return domainQuestions
}

type GroupedRegistrationCount struct {
	HappeningID string `db:"happening_id"`
	Max         *int   `db:"max"`
	Waiting     int    `db:"waiting"`
	Registered  int    `db:"registered"`
}

func (grc GroupedRegistrationCount) ToDomain() model.GroupedRegistrationCount {
	return model.GroupedRegistrationCount{
		HappeningID: grc.HappeningID,
		Max:         grc.Max,
		Waiting:     grc.Waiting,
		Registered:  grc.Registered,
	}
}

func GroupedRegistrationCountsToDomainList(counts []GroupedRegistrationCount) []model.GroupedRegistrationCount {
	domainCounts := make([]model.GroupedRegistrationCount, len(counts))
	for i, c := range counts {
		domainCounts[i] = c.ToDomain()
	}
	return domainCounts
}
