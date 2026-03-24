package api

import (
	"errors"
	"net/http"
	"strconv"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type sanityCMS struct {
	logger     port.Logger
	cmsService *service.CMSService
}

// NewSanityMux creates a router for all /sanity/* routes, including the
// existing webhook and all CMS read endpoints.
func NewSanityMux(
	logger port.Logger,
	happeningService *service.HappeningService,
	admin handler.Middleware,
	cmsService *service.CMSService,
) *router.Mux {
	mux := router.NewMux()

	// Existing webhook route
	sw := &sanityWebhook{logger: logger, happeningService: happeningService}
	mux.Handle("POST", "/webhook", sw.handleWebhook, admin)

	// CMS read routes
	s := &sanityCMS{logger: logger, cmsService: cmsService}

	mux.Handle("GET", "/happenings", s.getAllHappenings)
	mux.Handle("GET", "/happenings/home", s.getHomeHappenings)
	mux.Handle("GET", "/happenings/{slug}", s.getHappeningBySlug)
	mux.Handle("GET", "/happenings/{slug}/type", s.getHappeningTypeBySlug)
	mux.Handle("GET", "/happenings/{slug}/contacts", s.getHappeningContactsBySlug)
	mux.Handle("GET", "/repeating-happenings", s.getAllRepeatingHappenings)
	mux.Handle("GET", "/posts", s.getAllPosts)
	mux.Handle("GET", "/student-groups", s.getStudentGroups)
	mux.Handle("GET", "/student-groups/{slug}", s.getStudentGroupBySlug)
	mux.Handle("GET", "/job-ads", s.getAllJobAds)
	mux.Handle("GET", "/banner", s.getBanner)
	mux.Handle("GET", "/static-info", s.getAllStaticInfo)
	mux.Handle("GET", "/merch", s.getAllMerch)
	mux.Handle("GET", "/minutes", s.getAllMeetingMinutes)
	mux.Handle("GET", "/movies", s.getAllMovies)
	mux.Handle("GET", "/hs-applications", s.getAllHSApplications)

	return mux
}

// getAllHappenings returns all happenings from Sanity CMS
// @Summary      Get all happenings from CMS
// @Tags         sanity
// @Produce      json
// @Success      200  {array}   dto.CMSHappeningDTO  "OK"
// @Failure      500  {string}  string               "Internal Server Error"
// @Router       /sanity/happenings [get]
func (s *sanityCMS) getAllHappenings(ctx *handler.Context) error {
	happenings, err := s.cmsService.HappeningRepo().GetAllHappenings(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(happenings)
}

// getHappeningBySlug returns a single happening by slug from Sanity CMS
// @Summary      Get happening by slug from CMS
// @Tags         sanity
// @Produce      json
// @Param        slug  path      string               true  "Happening slug"
// @Success      200   {object}  dto.CMSHappeningDTO  "OK"
// @Failure      404   {string}  string               "Not Found"
// @Failure      500   {string}  string               "Internal Server Error"
// @Router       /sanity/happenings/{slug} [get]
func (s *sanityCMS) getHappeningBySlug(ctx *handler.Context) error {
	slug := ctx.PathValue("slug")
	happening, err := s.cmsService.HappeningRepo().GetHappeningBySlug(ctx.Context(), slug)
	if err != nil {
		return ctx.InternalServerError()
	}
	if happening == nil {
		return ctx.NotFound(errors.New("happening not found"))
	}
	return ctx.JSON(happening)
}

// getHomeHappenings returns upcoming/pinned happenings for the home page
// @Summary      Get home page happenings from CMS
// @Tags         sanity
// @Produce      json
// @Param        types[]  query     []string                 false  "Happening types (e.g. bedpres, event)"
// @Param        n        query     int                      false  "Max number of results (default 5)"
// @Success      200      {array}   dto.CMSHomeHappeningDTO  "OK"
// @Failure      500      {string}  string                   "Internal Server Error"
// @Router       /sanity/happenings/home [get]
func (s *sanityCMS) getHomeHappenings(ctx *handler.Context) error {
	types := ctx.R.URL.Query()["types[]"]
	if len(types) == 0 {
		types = []string{"bedpres", "event"}
	}

	n := 5
	if nStr, ok := ctx.QueryParam("n"); ok {
		if parsed, err := strconv.Atoi(nStr); err == nil && parsed > 0 {
			n = parsed
		}
	}

	happenings, err := s.cmsService.HappeningRepo().GetHomeHappenings(ctx.Context(), types, n)
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(happenings)
}

// getHappeningTypeBySlug returns the happeningType for a given slug
// @Summary      Get happening type by slug from CMS
// @Tags         sanity
// @Produce      json
// @Param        slug  path      string                   true  "Happening slug"
// @Success      200   {object}  dto.CMSHappeningTypeDTO  "OK"
// @Failure      500   {string}  string                   "Internal Server Error"
// @Router       /sanity/happenings/{slug}/type [get]
func (s *sanityCMS) getHappeningTypeBySlug(ctx *handler.Context) error {
	slug := ctx.PathValue("slug")
	happeningType, err := s.cmsService.HappeningRepo().GetHappeningTypeBySlug(ctx.Context(), slug)
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(dto.CMSHappeningTypeDTO{HappeningType: happeningType})
}

// getHappeningContactsBySlug returns the contacts for a happening by slug
// @Summary      Get happening contacts by slug from CMS
// @Tags         sanity
// @Produce      json
// @Param        slug  path      string             true  "Happening slug"
// @Success      200   {array}   dto.CMSContactDTO  "OK"
// @Failure      500   {string}  string             "Internal Server Error"
// @Router       /sanity/happenings/{slug}/contacts [get]
func (s *sanityCMS) getHappeningContactsBySlug(ctx *handler.Context) error {
	slug := ctx.PathValue("slug")
	contacts, err := s.cmsService.HappeningRepo().GetHappeningContactsBySlug(ctx.Context(), slug)
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(contacts)
}

// getAllRepeatingHappenings returns all repeating happenings from Sanity CMS
// @Summary      Get all repeating happenings from CMS
// @Tags         sanity
// @Produce      json
// @Success      200  {array}   dto.CMSRepeatingHappeningDTO  "OK"
// @Failure      500  {string}  string                        "Internal Server Error"
// @Router       /sanity/repeating-happenings [get]
func (s *sanityCMS) getAllRepeatingHappenings(ctx *handler.Context) error {
	happenings, err := s.cmsService.RepeatingHappeningRepo().GetAllRepeatingHappenings(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(happenings)
}

// getAllPosts returns all posts from Sanity CMS
// @Summary      Get all posts from CMS
// @Tags         sanity
// @Produce      json
// @Success      200  {array}   dto.CMSPostDTO  "OK"
// @Failure      500  {string}  string          "Internal Server Error"
// @Router       /sanity/posts [get]
func (s *sanityCMS) getAllPosts(ctx *handler.Context) error {
	posts, err := s.cmsService.PostRepo().GetAllPosts(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(posts)
}

// getStudentGroups returns student groups filtered by type from Sanity CMS
// @Summary      Get student groups from CMS
// @Tags         sanity
// @Produce      json
// @Param        type  query     string                  false  "Group type"
// @Param        n     query     int                     false  "Max number of results (default 50)"
// @Success      200   {array}   dto.CMSStudentGroupDTO  "OK"
// @Failure      500   {string}  string                  "Internal Server Error"
// @Router       /sanity/student-groups [get]
func (s *sanityCMS) getStudentGroups(ctx *handler.Context) error {
	groupType, _ := ctx.QueryParam("type")

	n := 50
	if nStr, ok := ctx.QueryParam("n"); ok {
		if parsed, err := strconv.Atoi(nStr); err == nil && parsed > 0 {
			n = parsed
		}
	}

	groups, err := s.cmsService.StudentGroupRepo().GetStudentGroupsByType(ctx.Context(), groupType, n)
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(groups)
}

// getStudentGroupBySlug returns a single student group by slug from Sanity CMS
// @Summary      Get student group by slug from CMS
// @Tags         sanity
// @Produce      json
// @Param        slug  path      string                  true  "Student group slug"
// @Success      200   {object}  dto.CMSStudentGroupDTO  "OK"
// @Failure      404   {string}  string                  "Not Found"
// @Failure      500   {string}  string                  "Internal Server Error"
// @Router       /sanity/student-groups/{slug} [get]
func (s *sanityCMS) getStudentGroupBySlug(ctx *handler.Context) error {
	slug := ctx.PathValue("slug")
	group, err := s.cmsService.StudentGroupRepo().GetStudentGroupBySlug(ctx.Context(), slug)
	if err != nil {
		return ctx.InternalServerError()
	}
	if group == nil {
		return ctx.NotFound(errors.New("student group not found"))
	}
	return ctx.JSON(group)
}

// getAllJobAds returns all active job ads from Sanity CMS
// @Summary      Get all job ads from CMS
// @Tags         sanity
// @Produce      json
// @Success      200  {array}   dto.CMSJobAdDTO  "OK"
// @Failure      500  {string}  string           "Internal Server Error"
// @Router       /sanity/job-ads [get]
func (s *sanityCMS) getAllJobAds(ctx *handler.Context) error {
	ads, err := s.cmsService.JobAdRepo().GetAllJobAds(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(ads)
}

// getBanner returns the active site banner from Sanity CMS
// @Summary      Get site banner from CMS
// @Tags         sanity
// @Produce      json
// @Success      200  {object}  dto.CMSBannerDTO  "OK"
// @Failure      404  {string}  string            "Not Found"
// @Failure      500  {string}  string            "Internal Server Error"
// @Router       /sanity/banner [get]
func (s *sanityCMS) getBanner(ctx *handler.Context) error {
	banner, err := s.cmsService.BannerRepo().GetBanner(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	if banner == nil {
		return ctx.Error(errors.New("banner not found"), http.StatusNotFound)
	}
	return ctx.JSON(banner)
}

// getAllStaticInfo returns all static info pages from Sanity CMS
// @Summary      Get all static info pages from CMS
// @Tags         sanity
// @Produce      json
// @Success      200  {array}   dto.CMSStaticInfoDTO  "OK"
// @Failure      500  {string}  string                "Internal Server Error"
// @Router       /sanity/static-info [get]
func (s *sanityCMS) getAllStaticInfo(ctx *handler.Context) error {
	info, err := s.cmsService.StaticInfoRepo().GetAllStaticInfo(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(info)
}

// getAllMerch returns all merch items from Sanity CMS
// @Summary      Get all merch items from CMS
// @Tags         sanity
// @Produce      json
// @Success      200  {array}   dto.CMSMerchDTO  "OK"
// @Failure      500  {string}  string           "Internal Server Error"
// @Router       /sanity/merch [get]
func (s *sanityCMS) getAllMerch(ctx *handler.Context) error {
	merch, err := s.cmsService.MerchRepo().GetAllMerch(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(merch)
}

// getAllMeetingMinutes returns all meeting minutes from Sanity CMS
// @Summary      Get all meeting minutes from CMS
// @Tags         sanity
// @Produce      json
// @Success      200  {array}   dto.CMSMeetingMinuteDTO  "OK"
// @Failure      500  {string}  string                   "Internal Server Error"
// @Router       /sanity/minutes [get]
func (s *sanityCMS) getAllMeetingMinutes(ctx *handler.Context) error {
	minutes, err := s.cmsService.MeetingMinuteRepo().GetAllMeetingMinutes(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(minutes)
}

// getAllMovies returns all movies from Sanity CMS
// @Summary      Get all movies from CMS
// @Tags         sanity
// @Produce      json
// @Success      200  {array}   dto.CMSMovieDTO  "OK"
// @Failure      500  {string}  string           "Internal Server Error"
// @Router       /sanity/movies [get]
func (s *sanityCMS) getAllMovies(ctx *handler.Context) error {
	movies, err := s.cmsService.MovieRepo().GetAllMovies(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(movies)
}

// getAllHSApplications returns all HS applications from Sanity CMS
// @Summary      Get all HS applications from CMS
// @Tags         sanity
// @Produce      json
// @Success      200  {array}   dto.CMSHSApplicationDTO  "OK"
// @Failure      500  {string}  string                   "Internal Server Error"
// @Router       /sanity/hs-applications [get]
func (s *sanityCMS) getAllHSApplications(ctx *handler.Context) error {
	applications, err := s.cmsService.HSApplicationRepo().GetAllHSApplications(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(applications)
}
