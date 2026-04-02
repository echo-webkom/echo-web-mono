package service

import (
	"context"
	"fmt"
	"strings"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	infracache "uno/infrastructure/cache"
)

const cmsCacheTTL = 10 * time.Minute

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

	happeningsCache          port.Cache[[]model.CMSHappening]
	happeningBySlugCache     port.Cache[*model.CMSHappening]
	homeHappeningsCache      port.Cache[[]model.CMSHomeHappening]
	contactsBySlugCache      port.Cache[[]model.CMSContact]
	repeatingHappeningsCache port.Cache[[]model.CMSRepeatingHappening]
	postsCache               port.Cache[[]model.CMSPost]
	studentGroupsByTypeCache  port.Cache[[]model.CMSStudentGroup]
	studentGroupBySlugCache  port.Cache[*model.CMSStudentGroup]
	jobAdsCache              port.Cache[[]model.CMSJobAd]
	bannerCache              port.Cache[*model.CMSBanner]
	staticInfoCache          port.Cache[[]model.CMSStaticInfo]
	merchCache               port.Cache[[]model.CMSMerch]
	meetingMinutesCache      port.Cache[[]model.CMSMeetingMinute]
	moviesCache              port.Cache[[]model.CMSMovie]
	hsApplicationsCache      port.Cache[[]model.CMSHSApplication]
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

		happeningsCache:          infracache.NewInMemoryCache[[]model.CMSHappening](),
		happeningBySlugCache:     infracache.NewInMemoryCache[*model.CMSHappening](),
		homeHappeningsCache:      infracache.NewInMemoryCache[[]model.CMSHomeHappening](),
		contactsBySlugCache:      infracache.NewInMemoryCache[[]model.CMSContact](),
		repeatingHappeningsCache: infracache.NewInMemoryCache[[]model.CMSRepeatingHappening](),
		postsCache:               infracache.NewInMemoryCache[[]model.CMSPost](),
		studentGroupsByTypeCache:  infracache.NewInMemoryCache[[]model.CMSStudentGroup](),
		studentGroupBySlugCache:  infracache.NewInMemoryCache[*model.CMSStudentGroup](),
		jobAdsCache:              infracache.NewInMemoryCache[[]model.CMSJobAd](),
		bannerCache:              infracache.NewInMemoryCache[*model.CMSBanner](),
		staticInfoCache:          infracache.NewInMemoryCache[[]model.CMSStaticInfo](),
		merchCache:               infracache.NewInMemoryCache[[]model.CMSMerch](),
		meetingMinutesCache:      infracache.NewInMemoryCache[[]model.CMSMeetingMinute](),
		moviesCache:              infracache.NewInMemoryCache[[]model.CMSMovie](),
		hsApplicationsCache:      infracache.NewInMemoryCache[[]model.CMSHSApplication](),
	}
}

func (s *CMSService) GetAllHappenings(ctx context.Context) ([]model.CMSHappening, error) {
	if v, ok := s.happeningsCache.Get("all"); ok {
		return v, nil
	}
	result, err := s.happeningRepo.GetAllHappenings(ctx)
	if err != nil {
		return nil, err
	}
	s.happeningsCache.Set("all", result, cmsCacheTTL)
	return result, nil
}

func (s *CMSService) GetHappeningBySlug(ctx context.Context, slug string) (*model.CMSHappening, error) {
	if v, ok := s.happeningBySlugCache.Get(slug); ok {
		return v, nil
	}
	result, err := s.happeningRepo.GetHappeningBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	s.happeningBySlugCache.Set(slug, result, cmsCacheTTL)
	return result, nil
}

func (s *CMSService) GetHomeHappenings(ctx context.Context, types []string, n int) ([]model.CMSHomeHappening, error) {
	key := fmt.Sprintf("%s:%d", strings.Join(types, ","), n)
	if v, ok := s.homeHappeningsCache.Get(key); ok {
		return v, nil
	}
	result, err := s.happeningRepo.GetHomeHappenings(ctx, types, n)
	if err != nil {
		return nil, err
	}
	s.homeHappeningsCache.Set(key, result, cmsCacheTTL)
	return result, nil
}

func (s *CMSService) GetHappeningContactsBySlug(ctx context.Context, slug string) ([]model.CMSContact, error) {
	if v, ok := s.contactsBySlugCache.Get(slug); ok {
		return v, nil
	}
	result, err := s.happeningRepo.GetHappeningContactsBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	s.contactsBySlugCache.Set(slug, result, cmsCacheTTL)
	return result, nil
}

func (s *CMSService) GetAllRepeatingHappenings(ctx context.Context) ([]model.CMSRepeatingHappening, error) {
	if v, ok := s.repeatingHappeningsCache.Get("all"); ok {
		return v, nil
	}
	result, err := s.repeatingHappeningRepo.GetAllRepeatingHappenings(ctx)
	if err != nil {
		return nil, err
	}
	s.repeatingHappeningsCache.Set("all", result, cmsCacheTTL)
	return result, nil
}

func (s *CMSService) GetAllPosts(ctx context.Context) ([]model.CMSPost, error) {
	if v, ok := s.postsCache.Get("all"); ok {
		return v, nil
	}
	result, err := s.postRepo.GetAllPosts(ctx)
	if err != nil {
		return nil, err
	}
	s.postsCache.Set("all", result, cmsCacheTTL)
	return result, nil
}

func (s *CMSService) GetStudentGroupsByType(ctx context.Context, groupType string, n int) ([]model.CMSStudentGroup, error) {
	key := fmt.Sprintf("%s:%d", groupType, n)
	if v, ok := s.studentGroupsByTypeCache.Get(key); ok {
		return v, nil
	}
	result, err := s.studentGroupRepo.GetStudentGroupsByType(ctx, groupType, n)
	if err != nil {
		return nil, err
	}
	s.studentGroupsByTypeCache.Set(key, result, cmsCacheTTL)
	return result, nil
}

func (s *CMSService) GetStudentGroupBySlug(ctx context.Context, slug string) (*model.CMSStudentGroup, error) {
	if v, ok := s.studentGroupBySlugCache.Get(slug); ok {
		return v, nil
	}
	result, err := s.studentGroupRepo.GetStudentGroupBySlug(ctx, slug)
	if err != nil {
		return nil, err
	}
	s.studentGroupBySlugCache.Set(slug, result, cmsCacheTTL)
	return result, nil
}

func (s *CMSService) GetAllJobAds(ctx context.Context) ([]model.CMSJobAd, error) {
	if v, ok := s.jobAdsCache.Get("all"); ok {
		return v, nil
	}
	result, err := s.jobAdRepo.GetAllJobAds(ctx)
	if err != nil {
		return nil, err
	}
	s.jobAdsCache.Set("all", result, cmsCacheTTL)
	return result, nil
}

func (s *CMSService) GetBanner(ctx context.Context) (*model.CMSBanner, error) {
	if v, ok := s.bannerCache.Get("banner"); ok {
		return v, nil
	}
	result, err := s.bannerRepo.GetBanner(ctx)
	if err != nil {
		return nil, err
	}
	s.bannerCache.Set("banner", result, cmsCacheTTL)
	return result, nil
}

func (s *CMSService) GetAllStaticInfo(ctx context.Context) ([]model.CMSStaticInfo, error) {
	if v, ok := s.staticInfoCache.Get("all"); ok {
		return v, nil
	}
	result, err := s.staticInfoRepo.GetAllStaticInfo(ctx)
	if err != nil {
		return nil, err
	}
	s.staticInfoCache.Set("all", result, cmsCacheTTL)
	return result, nil
}

func (s *CMSService) GetAllMerch(ctx context.Context) ([]model.CMSMerch, error) {
	if v, ok := s.merchCache.Get("all"); ok {
		return v, nil
	}
	result, err := s.merchRepo.GetAllMerch(ctx)
	if err != nil {
		return nil, err
	}
	s.merchCache.Set("all", result, cmsCacheTTL)
	return result, nil
}

func (s *CMSService) GetAllMeetingMinutes(ctx context.Context) ([]model.CMSMeetingMinute, error) {
	if v, ok := s.meetingMinutesCache.Get("all"); ok {
		return v, nil
	}
	result, err := s.meetingMinuteRepo.GetAllMeetingMinutes(ctx)
	if err != nil {
		return nil, err
	}
	s.meetingMinutesCache.Set("all", result, cmsCacheTTL)
	return result, nil
}

func (s *CMSService) GetAllMovies(ctx context.Context) ([]model.CMSMovie, error) {
	if v, ok := s.moviesCache.Get("all"); ok {
		return v, nil
	}
	result, err := s.movieRepo.GetAllMovies(ctx)
	if err != nil {
		return nil, err
	}
	s.moviesCache.Set("all", result, cmsCacheTTL)
	return result, nil
}

func (s *CMSService) GetAllHSApplications(ctx context.Context) ([]model.CMSHSApplication, error) {
	if v, ok := s.hsApplicationsCache.Get("all"); ok {
		return v, nil
	}
	result, err := s.hsApplicationRepo.GetAllHSApplications(ctx)
	if err != nil {
		return nil, err
	}
	s.hsApplicationsCache.Set("all", result, cmsCacheTTL)
	return result, nil
}
