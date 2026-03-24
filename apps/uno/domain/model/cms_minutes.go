package model

type CMSMeetingMinute struct {
	ID           string  `json:"_id"`
	IsAllMeeting *bool   `json:"isAllMeeting"`
	Date         *string `json:"date"`
	Title        *string `json:"title"`
	Document     *string `json:"document"`
}
