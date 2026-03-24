package model

import "encoding/json"

type CMSRepeatingHappening struct {
	ID            string            `json:"_id"`
	Type          string            `json:"_type"`
	Title         string            `json:"title"`
	Slug          string            `json:"slug"`
	HappeningType string            `json:"happeningType"`
	Organizers    []CMSOrganizerRef `json:"organizers"`
	Contacts      []CMSContact      `json:"contacts"`
	Location      *CMSLocation      `json:"location"`
	DayOfWeek     *string           `json:"dayOfWeek"`
	StartTime     *string           `json:"startTime"`
	EndTime       *string           `json:"endTime"`
	StartDate     *string           `json:"startDate"`
	EndDate       *string           `json:"endDate"`
	Interval      *int              `json:"interval"`
	Cost          *int              `json:"cost"`
	IgnoredDates  []string          `json:"ignoredDates"`
	ExternalLink  *string           `json:"externalLink"`
	Body          json.RawMessage   `json:"body"`
}
