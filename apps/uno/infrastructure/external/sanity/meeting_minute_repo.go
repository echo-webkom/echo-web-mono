package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/cache"
	"uno/pkg/sanity"

	"github.com/redis/go-redis/v9"
)

const (
	CMSMeetingMinuteNamespaceMeetingMinutes = "cms:meeting-minutes"
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
	client              *sanity.Client
	logger              port.Logger
	meetingMinutesCache port.Cache[[]model.CMSMeetingMinute]
}

func NewMeetingMinuteRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSMeetingMinuteRepo {
	return &MeetingMinuteRepo{
		client:              client,
		logger:              logger,
		meetingMinutesCache: cache.NewCache[[]model.CMSMeetingMinute](redisClient, CMSMeetingMinuteNamespaceMeetingMinutes, logger),
	}
}

func (r *MeetingMinuteRepo) GetAllMeetingMinutes(ctx context.Context) ([]model.CMSMeetingMinute, error) {
	r.logger.Info(ctx, "getting all meeting minutes from sanity")
	if v, ok := r.meetingMinutesCache.Get("all"); ok {
		r.logger.Info(ctx, "cache hit for all meeting minutes")
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for all meeting minutes")
	result, err := sanity.Query[[]model.CMSMeetingMinute](ctx, r.client, allMeetingMinutesQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to get all meeting minutes from sanity", "error", err)
		return nil, err
	}

	r.meetingMinutesCache.Set("all", result, cmsCacheTTL)
	return result, nil
}

func (r *MeetingMinuteRepo) GetMeetingMinuteById(ctx context.Context, id string) (*model.CMSMeetingMinute, error) {
	r.logger.Info(ctx, "getting meeting minute by id from sanity", "id", id)
	minutes, err := r.GetAllMeetingMinutes(ctx)
	if err != nil {
		return nil, err
	}

	for i := range minutes {
		if minutes[i].ID == id {
			r.logger.Info(ctx, "found meeting minute by id in all meeting minutes cache", "minute_id", id)
			return &minutes[i], nil
		}
	}

	r.logger.Info(ctx, "meeting minute by id not found in all meeting minutes cache", "minute_id", id)
	return nil, nil
}
