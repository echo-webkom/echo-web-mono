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
	CMSMeetingMinuteNamespaceMeetingMinutes    = "cms:meeting-minutes"
	CMSMeetingMinuteNamespaceMeetingMinuteByID = "cms:meeting-minute-by-id"
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
	client                 *sanity.Client
	logger                 port.Logger
	meetingMinutesCache    port.Cache[[]model.CMSMeetingMinute]
	meetingMinuteByIDCache port.Cache[*model.CMSMeetingMinute]
}

func NewMeetingMinuteRepo(client *sanity.Client, logger port.Logger, redisClient *redis.Client) port.CMSMeetingMinuteRepo {
	return &MeetingMinuteRepo{
		client:                 client,
		logger:                 logger,
		meetingMinutesCache:    cache.NewCache[[]model.CMSMeetingMinute](redisClient, CMSMeetingMinuteNamespaceMeetingMinutes),
		meetingMinuteByIDCache: cache.NewCache[*model.CMSMeetingMinute](redisClient, CMSMeetingMinuteNamespaceMeetingMinuteByID),
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
	if v, ok := r.meetingMinuteByIDCache.Get(id); ok {
		r.logger.Info(ctx, "cache hit for meeting minute by id", "id", id)
		return v, nil
	}
	r.logger.Info(ctx, "cache miss for meeting minute by id", "id", id)
	result, err := sanity.Query[*model.CMSMeetingMinute](ctx, r.client, meetingMinuteByIdQuery, map[string]any{
		"id": id,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to get meeting minute by id from sanity", "id", id, "error", err)
		return nil, err
	}

	r.meetingMinuteByIDCache.Set(id, result, cmsCacheTTL)
	return result, nil
}
