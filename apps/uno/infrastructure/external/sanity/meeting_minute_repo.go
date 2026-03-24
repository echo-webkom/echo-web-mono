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
