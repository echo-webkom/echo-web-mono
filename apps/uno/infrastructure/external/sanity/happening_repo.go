package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/sanity"
)

const allHappeningsQuery = `
*[_type == "happening"
  && !(_id in path('drafts.**'))]
  | order(date asc) {
    _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  isPinned,
  happeningType,
  "company": company->{
    _id,
    name,
    website,
    image,
  },
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
  "date": date,
  "endDate": endDate,
  cost,
  "registrationStartGroups": registrationStartGroups,
  "registrationGroups": registrationGroups[]->slug.current,
  "registrationStart": registrationStart,
  "registrationEnd": registrationEnd,
  "location": location->{
    name,
    link
  },
  "spotRanges": spotRanges[] {
    spots,
    minYear,
    maxYear,
  },
  "additionalQuestions": additionalQuestions[] {
    id,
    title,
    required,
    type,
    options,
  },
  externalLink,
  body
}
`

const happeningBySlugQuery = `
*[_type == "happening"
  && !(_id in path('drafts.**'))
  && slug.current == $slug
][0] {
  _id,
  _createdAt,
  _updatedAt,
  _type,
  title,
  "slug": slug.current,
  isPinned,
  happeningType,
  hideRegistrations,
  "company": company->{
    _id,
    name,
    website,
    image,
  },
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
  "date": date,
  "endDate": endDate,
  cost,
  "registrationStartGroups": registrationStartGroups,
  "registrationGroups": registrationGroups[]->slug.current,
  "registrationStart": registrationStart,
  "registrationEnd": registrationEnd,
  "location": location->{
    name,
    link
  },
  "spotRanges": spotRanges[] {
    spots,
    minYear,
    maxYear,
  },
  "additionalQuestions": additionalQuestions[] {
    title,
    required,
    type,
    options,
  },
  externalLink,
  body
}
`

const homeHappeningsQuery = `
*[_type == "happening"
  && !(_id in path('drafts.**'))
  && (isPinned || date >= now())
  && happeningType in $happeningTypes
]
| order(coalesce(isPinned, false) desc, date asc) {
  _id,
  title,
  isPinned,
  happeningType,
  date,
  registrationStart,
  "slug": slug.current,
  "image": company->image,
  "organizers": organizers[]->{
    name
  }.name
}[0...$n]
`

const happeningTypeBySlugQuery = `
*[_type == "happening"
  && !(_id in path('drafts.**'))
  && slug.current == $slug
 ] {
  happeningType,
}[0].happeningType
`

const happeningContactsBySlugQuery = `
*[_type == "happening" && slug.current == $slug] {
"contacts": contacts[] {
email,
"profile": profile->{
  _id,
  name,
},
},
}[0].contacts
`

type HappeningRepo struct {
	client *sanity.Client
	logger port.Logger
}

func NewHappeningRepo(client *sanity.Client, logger port.Logger) port.CMSHappeningRepo {
	return &HappeningRepo{client: client, logger: logger}
}

func (r *HappeningRepo) GetAllHappenings(ctx context.Context) ([]model.CMSHappening, error) {
	result, err := sanity.Query[[]model.CMSHappening](ctx, r.client, allHappeningsQuery, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to fetch all happenings from sanity", "error", err)
		return nil, err
	}
	return result, nil
}

func (r *HappeningRepo) GetHappeningBySlug(ctx context.Context, slug string) (*model.CMSHappening, error) {
	result, err := sanity.Query[*model.CMSHappening](ctx, r.client, happeningBySlugQuery, map[string]any{
		"slug": slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to fetch happening by slug from sanity", "slug", slug, "error", err)
		return nil, err
	}
	return result, nil
}

func (r *HappeningRepo) GetHomeHappenings(ctx context.Context, types []string, n int) ([]model.CMSHomeHappening, error) {
	result, err := sanity.Query[[]model.CMSHomeHappening](ctx, r.client, homeHappeningsQuery, map[string]any{
		"happeningTypes": types,
		"n":              n,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to fetch home happenings from sanity", "error", err)
		return nil, err
	}
	return result, nil
}

func (r *HappeningRepo) GetHappeningTypeBySlug(ctx context.Context, slug string) (string, error) {
	result, err := sanity.Query[string](ctx, r.client, happeningTypeBySlugQuery, map[string]any{
		"slug": slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to fetch happening type from sanity", "slug", slug, "error", err)
		return "", err
	}
	return result, nil
}

func (r *HappeningRepo) GetHappeningContactsBySlug(ctx context.Context, slug string) ([]model.CMSContact, error) {
	result, err := sanity.Query[[]model.CMSContact](ctx, r.client, happeningContactsBySlugQuery, map[string]any{
		"slug": slug,
	})
	if err != nil {
		r.logger.Error(ctx, "failed to fetch happening contacts from sanity", "slug", slug, "error", err)
		return nil, err
	}
	return result, nil
}
