package port

import (
	"context"
	"uno/domain/model"
)

type CMSHappeningRepo interface {
	GetAllHappenings(ctx context.Context) ([]model.CMSHappening, error)
	GetHappeningBySlug(ctx context.Context, slug string) (*model.CMSHappening, error)
	GetHomeHappenings(ctx context.Context, types []string, n int) ([]model.CMSHomeHappening, error)
	GetHappeningContactsBySlug(ctx context.Context, slug string) ([]model.CMSContact, error)
}

type CMSRepeatingHappeningRepo interface {
	GetAllRepeatingHappenings(ctx context.Context) ([]model.CMSRepeatingHappening, error)
	GetRepeatingHappeningBySlug(ctx context.Context, slug string) (*model.CMSRepeatingHappening, error)
}

type CMSPostRepo interface {
	GetAllPosts(ctx context.Context) ([]model.CMSPost, error)
	GetPostBySlug(ctx context.Context, slug string) (*model.CMSPost, error)
}

type CMSStudentGroupRepo interface {
	GetStudentGroupsByType(ctx context.Context, groupType string, n int) ([]model.CMSStudentGroup, error)
	GetStudentGroupBySlug(ctx context.Context, slug string) (*model.CMSStudentGroup, error)
}

type CMSJobAdRepo interface {
	GetAllJobAds(ctx context.Context) ([]model.CMSJobAd, error)
	GetJobAdBySlug(ctx context.Context, slug string) (*model.CMSJobAd, error)
}

type CMSBannerRepo interface {
	GetBanner(ctx context.Context) (*model.CMSBanner, error)
}

type CMSStaticInfoRepo interface {
	GetAllStaticInfo(ctx context.Context) ([]model.CMSStaticInfo, error)
	GetStaticInfoBySlug(ctx context.Context, slug string) (*model.CMSStaticInfo, error)
}

type CMSMerchRepo interface {
	GetAllMerch(ctx context.Context) ([]model.CMSMerch, error)
	GetMerchBySlug(ctx context.Context, slug string) (*model.CMSMerch, error)
}

type CMSMeetingMinuteRepo interface {
	GetAllMeetingMinutes(ctx context.Context) ([]model.CMSMeetingMinute, error)
	GetMeetingMinuteById(ctx context.Context, id string) (*model.CMSMeetingMinute, error)
}

type CMSMovieRepo interface {
	GetAllMovies(ctx context.Context) ([]model.CMSMovie, error)
	GetUpcomingMovies(ctx context.Context, n int) ([]model.CMSMovie, error)
}

type CMSHSApplicationRepo interface {
	GetAllHSApplications(ctx context.Context) ([]model.CMSHSApplication, error)
}
