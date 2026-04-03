package service

import (
	"context"
	"sort"
	"strings"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	sanityinfra "uno/infrastructure/external/sanity"
)

var cmsTypeNamespaces = map[string][]string{
	"happening":          {sanityinfra.CMSHappeningNamespaceHappenings, sanityinfra.CMSHappeningNamespaceHomeHappenings, sanityinfra.CMSHappeningNamespaceContactsBySlug},
	"repeatingHappening": {sanityinfra.CMSRepeatingHappeningNamespaceRepeatingHappenings},
	"post":               {sanityinfra.CMSPostNamespacePosts},
	"studentGroup":       {sanityinfra.CMSStudentGroupNamespaceStudentGroups},
	"profile":            {sanityinfra.CMSStudentGroupNamespaceStudentGroups},
	"job":                {sanityinfra.CMSJobAdNamespaceJobAds},
	"banner":             {sanityinfra.CMSBannerNamespaceBanner},
	"staticInfo":         {sanityinfra.CMSStaticInfoNamespaceStaticInfo},
	"merch":              {sanityinfra.CMSMerchNamespaceMerch},
	"meetingMinute":      {sanityinfra.CMSMeetingMinuteNamespaceMeetingMinutes},
	"movie":              {sanityinfra.CMSMovieNamespaceMovies},
}

type CMSService struct {
	happeningRepo          port.CMSHappeningRepo
	repeatingHappeningRepo port.CMSRepeatingHappeningRepo
	postRepo               port.CMSPostRepo
	studentGroupRepo       port.CMSStudentGroupRepo
	jobAdRepo              port.CMSJobAdRepo
	bannerRepo             port.CMSBannerRepo
	staticInfoRepo         port.CMSStaticInfoRepo
	merchRepo              port.CMSMerchRepo
	meetingMinuteRepo      port.CMSMeetingMinuteRepo
	movieRepo              port.CMSMovieRepo
	hsApplicationRepo      port.CMSHSApplicationRepo

	invalidator port.CacheInvalidator
}

func NewCMSService(
	happeningRepo port.CMSHappeningRepo,
	repeatingHappeningRepo port.CMSRepeatingHappeningRepo,
	postRepo port.CMSPostRepo,
	studentGroupRepo port.CMSStudentGroupRepo,
	jobAdRepo port.CMSJobAdRepo,
	bannerRepo port.CMSBannerRepo,
	staticInfoRepo port.CMSStaticInfoRepo,
	merchRepo port.CMSMerchRepo,
	meetingMinuteRepo port.CMSMeetingMinuteRepo,
	movieRepo port.CMSMovieRepo,
	hsApplicationRepo port.CMSHSApplicationRepo,
	invalidator port.CacheInvalidator,
) *CMSService {
	return &CMSService{
		happeningRepo:          happeningRepo,
		repeatingHappeningRepo: repeatingHappeningRepo,
		postRepo:               postRepo,
		studentGroupRepo:       studentGroupRepo,
		jobAdRepo:              jobAdRepo,
		bannerRepo:             bannerRepo,
		staticInfoRepo:         staticInfoRepo,
		merchRepo:              merchRepo,
		meetingMinuteRepo:      meetingMinuteRepo,
		movieRepo:              movieRepo,
		hsApplicationRepo:      hsApplicationRepo,

		invalidator: invalidator,
	}
}

func (s *CMSService) GetAllHappenings(ctx context.Context) ([]model.CMSHappening, error) {
	return s.happeningRepo.GetAllHappenings(ctx)
}

func (s *CMSService) GetHappeningBySlug(ctx context.Context, slug string) (*model.CMSHappening, error) {
	return s.happeningRepo.GetHappeningBySlug(ctx, slug)
}

func (s *CMSService) GetHomeHappenings(ctx context.Context, types []string, n int) ([]model.CMSHomeHappening, error) {
	return s.happeningRepo.GetHomeHappenings(ctx, types, n)
}

func (s *CMSService) GetHappeningContactsBySlug(ctx context.Context, slug string) ([]model.CMSContact, error) {
	return s.happeningRepo.GetHappeningContactsBySlug(ctx, slug)
}

func (s *CMSService) GetAllRepeatingHappenings(ctx context.Context) ([]model.CMSRepeatingHappening, error) {
	return s.repeatingHappeningRepo.GetAllRepeatingHappenings(ctx)
}

func (s *CMSService) GetAllPosts(ctx context.Context) ([]model.CMSPost, error) {
	return s.postRepo.GetAllPosts(ctx)
}

func (s *CMSService) GetStudentGroupsByType(ctx context.Context, groupType string) ([]model.CMSStudentGroup, error) {
	result, err := s.studentGroupRepo.GetStudentGroupsByType(ctx, groupType)
	if err != nil {
		return nil, err
	}
	if groupType == "board" {
		sort.Slice(result, func(i, j int) bool { return result[i].Name > result[j].Name })
	} else {
		sort.Slice(result, func(i, j int) bool { return result[i].Name < result[j].Name })
	}
	return result, nil
}

func (s *CMSService) GetStudentGroupBySlug(ctx context.Context, slug string) (*model.CMSStudentGroup, error) {
	return s.studentGroupRepo.GetStudentGroupBySlug(ctx, slug)
}

func (s *CMSService) GetAllJobAds(ctx context.Context) ([]model.CMSJobAd, error) {
	return s.jobAdRepo.GetAllJobAds(ctx)
}

func (s *CMSService) GetBanner(ctx context.Context) (*model.CMSBanner, error) {
	return s.bannerRepo.GetBanner(ctx)
}

func (s *CMSService) GetAllStaticInfo(ctx context.Context) ([]model.CMSStaticInfo, error) {
	return s.staticInfoRepo.GetAllStaticInfo(ctx)
}

func (s *CMSService) GetAllMerch(ctx context.Context) ([]model.CMSMerch, error) {
	return s.merchRepo.GetAllMerch(ctx)
}

func (s *CMSService) GetAllMeetingMinutes(ctx context.Context) ([]model.CMSMeetingMinute, error) {
	return s.meetingMinuteRepo.GetAllMeetingMinutes(ctx)
}

func (s *CMSService) GetAllMovies(ctx context.Context) ([]model.CMSMovie, error) {
	return s.movieRepo.GetAllMovies(ctx)
}

func (s *CMSService) GetAllHSApplications(ctx context.Context) ([]model.CMSHSApplication, error) {
	return s.hsApplicationRepo.GetAllHSApplications(ctx)
}

func (s *CMSService) GetRepeatingHappeningBySlug(ctx context.Context, slug string) (*model.CMSRepeatingHappening, error) {
	return s.repeatingHappeningRepo.GetRepeatingHappeningBySlug(ctx, slug)
}

func (s *CMSService) GetPostBySlug(ctx context.Context, slug string) (*model.CMSPost, error) {
	return s.postRepo.GetPostBySlug(ctx, slug)
}

func (s *CMSService) GetMerchBySlug(ctx context.Context, slug string) (*model.CMSMerch, error) {
	return s.merchRepo.GetMerchBySlug(ctx, slug)
}

func (s *CMSService) GetJobAdBySlug(ctx context.Context, slug string) (*model.CMSJobAd, error) {
	return s.jobAdRepo.GetJobAdBySlug(ctx, slug)
}

func (s *CMSService) GetStaticInfoBySlug(ctx context.Context, slug string) (*model.CMSStaticInfo, error) {
	return s.staticInfoRepo.GetStaticInfoBySlug(ctx, slug)
}

func (s *CMSService) GetMeetingMinuteById(ctx context.Context, id string) (*model.CMSMeetingMinute, error) {
	return s.meetingMinuteRepo.GetMeetingMinuteById(ctx, id)
}

func (s *CMSService) GetUpcomingMovies(ctx context.Context, n int) ([]model.CMSMovie, error) {
	return s.movieRepo.GetUpcomingMovies(ctx, n)
}

// CMSHappeningFilter holds filter parameters for GetFilteredHappenings.
type CMSHappeningFilter struct {
	Search   string
	Type     string
	Open     bool
	Past     bool
	DateFrom []time.Time
	DateTo   []time.Time
}

func (s *CMSService) GetFilteredHappenings(ctx context.Context, filter CMSHappeningFilter) ([]model.CMSHappening, error) {
	happenings, err := s.GetAllHappenings(ctx)
	if err != nil {
		return nil, err
	}

	now := time.Now()
	result := make([]model.CMSHappening, 0, len(happenings))

	for _, h := range happenings {
		if h.Date == nil {
			continue
		}

		relevantDateStr := *h.Date
		if h.EndDate != nil {
			relevantDateStr = *h.EndDate
		}
		relevantDate, err := time.Parse(time.RFC3339, relevantDateStr)
		if err != nil {
			continue
		}

		if filter.Past {
			if !relevantDate.Before(now) {
				continue
			}
		} else if len(filter.DateFrom) == 0 {
			if relevantDate.Before(now.Add(-5 * time.Minute)) {
				continue
			}
		}

		if filter.Type != "" && filter.Type != "all" && h.HappeningType != filter.Type {
			continue
		}

		if filter.Open {
			if h.RegistrationStart == nil || h.RegistrationEnd == nil {
				continue
			}
			regStart, err1 := time.Parse(time.RFC3339, *h.RegistrationStart)
			regEnd, err2 := time.Parse(time.RFC3339, *h.RegistrationEnd)
			if err1 != nil || err2 != nil || !regStart.Before(now) || !regEnd.After(now) {
				continue
			}
		}

		if filter.Search != "" {
			searchLower := strings.ToLower(filter.Search)
			titleMatch := strings.Contains(strings.ToLower(h.Title), searchLower)
			orgMatch := false
			for _, org := range h.Organizers {
				if strings.Contains(strings.ToLower(org.Name), searchLower) {
					orgMatch = true
					break
				}
			}
			if !titleMatch && !orgMatch {
				continue
			}
		}

		result = append(result, h)
	}

	if len(filter.DateFrom) > 0 && !filter.Past {
		filtered := make([]model.CMSHappening, 0, len(result))
		for _, h := range result {
			date, err := time.Parse(time.RFC3339, *h.Date)
			if err != nil {
				continue
			}
			endDate := date
			if h.EndDate != nil {
				if d, err := time.Parse(time.RFC3339, *h.EndDate); err == nil {
					endDate = d
				}
			}
			for i, from := range filter.DateFrom {
				var to time.Time
				if i < len(filter.DateTo) {
					to = filter.DateTo[i]
				}
				startOk := from.IsZero() || !date.Before(from) || (!endDate.IsZero() && !endDate.Before(from))
				endOk := to.IsZero() || date.Before(to)
				if startOk && endOk {
					filtered = append(filtered, h)
					break
				}
			}
		}
		result = filtered
	}

	return result, nil
}

// InvalidateByType invalidates all cache namespaces related to the given Sanity document type.
func (s *CMSService) InvalidateByType(ctx context.Context, docType string) {
	namespaces, ok := cmsTypeNamespaces[docType]
	if !ok {
		return
	}
	for _, ns := range namespaces {
		s.invalidator.InvalidateNamespace(ctx, ns)
	}
}
