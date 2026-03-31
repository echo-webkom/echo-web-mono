package service

import (
	"context"
	"fmt"
	"strings"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/cache"
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

	happeningsCache          *cache.Cache[string, []model.CMSHappening]
	happeningBySlugCache     *cache.Cache[string, *model.CMSHappening]
	homeHappeningsCache      *cache.Cache[string, []model.CMSHomeHappening]
	contactsBySlugCache      *cache.Cache[string, []model.CMSContact]
	repeatingHappeningsCache *cache.Cache[string, []model.CMSRepeatingHappening]
	postsCache               *cache.Cache[string, []model.CMSPost]
	studentGroupsByTypeCache *cache.Cache[string, []model.CMSStudentGroup]
	studentGroupBySlugCache  *cache.Cache[string, *model.CMSStudentGroup]
	jobAdsCache              *cache.Cache[string, []model.CMSJobAd]
	bannerCache              *cache.Cache[string, *model.CMSBanner]
	staticInfoCache          *cache.Cache[string, []model.CMSStaticInfo]
	merchCache               *cache.Cache[string, []model.CMSMerch]
	meetingMinutesCache      *cache.Cache[string, []model.CMSMeetingMinute]
	moviesCache              *cache.Cache[string, []model.CMSMovie]
	hsApplicationsCache      *cache.Cache[string, []model.CMSHSApplication]
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

		happeningsCache:          cache.New[string, []model.CMSHappening](cmsCacheTTL),
		happeningBySlugCache:     cache.New[string, *model.CMSHappening](cmsCacheTTL),
		homeHappeningsCache:      cache.New[string, []model.CMSHomeHappening](cmsCacheTTL),
		contactsBySlugCache:      cache.New[string, []model.CMSContact](cmsCacheTTL),
		repeatingHappeningsCache: cache.New[string, []model.CMSRepeatingHappening](cmsCacheTTL),
		postsCache:               cache.New[string, []model.CMSPost](cmsCacheTTL),
		studentGroupsByTypeCache: cache.New[string, []model.CMSStudentGroup](cmsCacheTTL),
		studentGroupBySlugCache:  cache.New[string, *model.CMSStudentGroup](cmsCacheTTL),
		jobAdsCache:              cache.New[string, []model.CMSJobAd](cmsCacheTTL),
		bannerCache:              cache.New[string, *model.CMSBanner](cmsCacheTTL),
		staticInfoCache:          cache.New[string, []model.CMSStaticInfo](cmsCacheTTL),
		merchCache:               cache.New[string, []model.CMSMerch](cmsCacheTTL),
		meetingMinutesCache:      cache.New[string, []model.CMSMeetingMinute](cmsCacheTTL),
		moviesCache:              cache.New[string, []model.CMSMovie](cmsCacheTTL),
		hsApplicationsCache:      cache.New[string, []model.CMSHSApplication](cmsCacheTTL),
	}
}

func (s *CMSService) GetAllHappenings(ctx context.Context) ([]model.CMSHappening, error) {
	return s.happeningsCache.GetOrSet(ctx, "all", s.happeningRepo.GetAllHappenings)
}

func (s *CMSService) GetHappeningBySlug(ctx context.Context, slug string) (*model.CMSHappening, error) {
	return s.happeningBySlugCache.GetOrSet(ctx, slug, func(ctx context.Context) (*model.CMSHappening, error) {
		return s.happeningRepo.GetHappeningBySlug(ctx, slug)
	})
}

func (s *CMSService) GetHomeHappenings(ctx context.Context, types []string, n int) ([]model.CMSHomeHappening, error) {
	key := fmt.Sprintf("%s:%d", strings.Join(types, ","), n)
	return s.homeHappeningsCache.GetOrSet(ctx, key, func(ctx context.Context) ([]model.CMSHomeHappening, error) {
		return s.happeningRepo.GetHomeHappenings(ctx, types, n)
	})
}

func (s *CMSService) GetHappeningContactsBySlug(ctx context.Context, slug string) ([]model.CMSContact, error) {
	return s.contactsBySlugCache.GetOrSet(ctx, slug, func(ctx context.Context) ([]model.CMSContact, error) {
		return s.happeningRepo.GetHappeningContactsBySlug(ctx, slug)
	})
}

func (s *CMSService) GetAllRepeatingHappenings(ctx context.Context) ([]model.CMSRepeatingHappening, error) {
	return s.repeatingHappeningsCache.GetOrSet(ctx, "all", s.repeatingHappeningRepo.GetAllRepeatingHappenings)
}

func (s *CMSService) GetAllPosts(ctx context.Context) ([]model.CMSPost, error) {
	return s.postsCache.GetOrSet(ctx, "all", s.postRepo.GetAllPosts)
}

func (s *CMSService) GetStudentGroupsByType(ctx context.Context, groupType string, n int) ([]model.CMSStudentGroup, error) {
	key := fmt.Sprintf("%s:%d", groupType, n)
	return s.studentGroupsByTypeCache.GetOrSet(ctx, key, func(ctx context.Context) ([]model.CMSStudentGroup, error) {
		return s.studentGroupRepo.GetStudentGroupsByType(ctx, groupType, n)
	})
}

func (s *CMSService) GetStudentGroupBySlug(ctx context.Context, slug string) (*model.CMSStudentGroup, error) {
	return s.studentGroupBySlugCache.GetOrSet(ctx, slug, func(ctx context.Context) (*model.CMSStudentGroup, error) {
		return s.studentGroupRepo.GetStudentGroupBySlug(ctx, slug)
	})
}

func (s *CMSService) GetAllJobAds(ctx context.Context) ([]model.CMSJobAd, error) {
	return s.jobAdsCache.GetOrSet(ctx, "all", s.jobAdRepo.GetAllJobAds)
}

func (s *CMSService) GetBanner(ctx context.Context) (*model.CMSBanner, error) {
	return s.bannerCache.GetOrSet(ctx, "banner", s.bannerRepo.GetBanner)
}

func (s *CMSService) GetAllStaticInfo(ctx context.Context) ([]model.CMSStaticInfo, error) {
	return s.staticInfoCache.GetOrSet(ctx, "all", s.staticInfoRepo.GetAllStaticInfo)
}

func (s *CMSService) GetAllMerch(ctx context.Context) ([]model.CMSMerch, error) {
	return s.merchCache.GetOrSet(ctx, "all", s.merchRepo.GetAllMerch)
}

func (s *CMSService) GetAllMeetingMinutes(ctx context.Context) ([]model.CMSMeetingMinute, error) {
	return s.meetingMinutesCache.GetOrSet(ctx, "all", s.meetingMinuteRepo.GetAllMeetingMinutes)
}

func (s *CMSService) GetAllMovies(ctx context.Context) ([]model.CMSMovie, error) {
	return s.moviesCache.GetOrSet(ctx, "all", s.movieRepo.GetAllMovies)
}

func (s *CMSService) GetAllHSApplications(ctx context.Context) ([]model.CMSHSApplication, error) {
	return s.hsApplicationsCache.GetOrSet(ctx, "all", s.hsApplicationRepo.GetAllHSApplications)
}
