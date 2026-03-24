package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/sanity"
)

const allRepeatingHappeningsQuery = `
*[_type == "repeatingHappening"
  && !(_id in path('drafts.**'))] {
  _id,
  _type,
  title,
  "slug": slug.current,
  happeningType,
  "organizers": organizers[]->{
    _id,
    name,
    "slug": slug.current
  },
  "contacts": contacts[] {
    email,
    "profile": profile->{
      _id,
      name,
    },
  },
  "location": location->{
    name,
    link,
  },
  dayOfWeek,
  startTime,
  endTime,
  startDate,
  endDate,
  interval,
  cost,
  ignoredDates,
  externalLink,
  body,
}
`

type RepeatingHappeningRepo struct {
	client *sanity.Client
	logger port.Logger
}

func NewRepeatingHappeningRepo(client *sanity.Client, logger port.Logger) port.CMSRepeatingHappeningRepo {
	return &RepeatingHappeningRepo{client: client, logger: logger}
}

func (r *RepeatingHappeningRepo) GetAllRepeatingHappenings(ctx context.Context) ([]model.CMSRepeatingHappening, error) {
	result, err := sanity.Query[[]model.CMSRepeatingHappening](ctx, r.client, allRepeatingHappeningsQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to fetch repeating happenings from sanity", "error", err)
		return nil, err
	}
	return result, nil
}
