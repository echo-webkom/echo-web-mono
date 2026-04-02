package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/sanity"
)

const allMeetingMinutesQuery = `
*[_type == "meetingMinute" && !(_id in path('drafts.**'))] | order(date desc) {
  _id,
  isAllMeeting,
  date,
  title,
  "document": document.asset->url
}
`

type MeetingMinuteRepo struct {
	client *sanity.Client
	logger port.Logger
}

func NewMeetingMinuteRepo(client *sanity.Client, logger port.Logger) port.CMSMeetingMinuteRepo {
	return &MeetingMinuteRepo{client: client, logger: logger}
}

func (r *MeetingMinuteRepo) GetAllMeetingMinutes(ctx context.Context) ([]model.CMSMeetingMinute, error) {
	r.logger.Info(ctx, "getting all meeting minutes from sanity")
	result, err := sanity.Query[[]model.CMSMeetingMinute](ctx, r.client, allMeetingMinutesQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all meeting minutes from sanity", "error", err)
		return nil, err
	}
	return result, nil
}

const meetingMinuteByIdQuery = `
*[_type == "meetingMinute" && _id == $id && !(_id in path('drafts.**'))] {
  _id,
  isAllMeeting,
  date,
  title,
  "document": document.asset->url
}[0]
`

func (r *MeetingMinuteRepo) GetMeetingMinuteById(ctx context.Context, id string) (*model.CMSMeetingMinute, error) {
	r.logger.Info(ctx, "getting meeting minute by id from sanity", "id", id)
	result, err := sanity.Query[*model.CMSMeetingMinute](ctx, r.client, meetingMinuteByIdQuery, map[string]any{
		"id": id,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get meeting minute by id from sanity", "id", id, "error", err)
		return nil, err
	}
	return result, nil
}
