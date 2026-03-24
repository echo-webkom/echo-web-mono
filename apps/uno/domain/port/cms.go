package port

import (
	"context"
	"uno/domain/model"
)

type CMSHappeningRepo interface {
	GetAllHappenings(ctx context.Context) ([]model.CMSHappening, error)
	GetHappeningBySlug(ctx context.Context, slug string) (*model.CMSHappening, error)
	GetHomeHappenings(ctx context.Context, types []string, n int) ([]model.CMSHomeHappening, error)
	GetHappeningTypeBySlug(ctx context.Context, slug string) (string, error)
	GetHappeningContactsBySlug(ctx context.Context, slug string) ([]model.CMSContact, error)
}

type CMSRepeatingHappeningRepo interface {
	GetAllRepeatingHappenings(ctx context.Context) ([]model.CMSRepeatingHappening, error)
}

type CMSPostRepo interface {
	GetAllPosts(ctx context.Context) ([]model.CMSPost, error)
}

type CMSStudentGroupRepo interface {
	GetStudentGroupsByType(ctx context.Context, groupType string, n int) ([]model.CMSStudentGroup, error)
	GetStudentGroupBySlug(ctx context.Context, slug string) (*model.CMSStudentGroup, error)
}

type CMSJobAdRepo interface {
	GetAllJobAds(ctx context.Context) ([]model.CMSJobAd, error)
}

type CMSBannerRepo interface {
	GetBanner(ctx context.Context) (*model.CMSBanner, error)
}

type CMSStaticInfoRepo interface {
	GetAllStaticInfo(ctx context.Context) ([]model.CMSStaticInfo, error)
}

type CMSMerchRepo interface {
	GetAllMerch(ctx context.Context) ([]model.CMSMerch, error)
}

type CMSMeetingMinuteRepo interface {
	GetAllMeetingMinutes(ctx context.Context) ([]model.CMSMeetingMinute, error)
}

type CMSMovieRepo interface {
	GetAllMovies(ctx context.Context) ([]model.CMSMovie, error)
}

type CMSHSApplicationRepo interface {
	GetAllHSApplications(ctx context.Context) ([]model.CMSHSApplication, error)
}
