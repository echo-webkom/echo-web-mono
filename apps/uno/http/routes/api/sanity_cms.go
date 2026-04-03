package api

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"
	"time"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type sanityCMS struct {
	logger           port.Logger
	cmsService       *service.CMSService
	happeningService *service.HappeningService
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

	// CMS read routes
	s := &sanityCMS{logger: logger, cmsService: cmsService, happeningService: happeningService}

	mux.Handle("POST", "/webhook", s.handleWebhook, admin)
	mux.Handle("POST", "/revalidate", s.handleRevalidate, admin)

	mux.Handle("GET", "/happenings", s.getAllHappenings)
	mux.Handle("GET", "/happenings/home", s.getHomeHappenings)
	mux.Handle("GET", "/happenings/filtered", s.getFilteredHappenings)
	mux.Handle("GET", "/happenings/{slug}", s.getHappeningBySlug)
	mux.Handle("GET", "/happenings/{slug}/contacts", s.getHappeningContactsBySlug)
	mux.Handle("GET", "/repeating-happenings", s.getAllRepeatingHappenings)
	mux.Handle("GET", "/repeating-happenings/{slug}", s.getRepeatingHappeningBySlug)

	mux.Handle("GET", "/posts", s.getAllPosts)
	mux.Handle("GET", "/posts/{slug}", s.getPostBySlug)

	mux.Handle("GET", "/student-groups", s.getStudentGroups)
	mux.Handle("GET", "/student-groups/{slug}", s.getStudentGroupBySlug)

	mux.Handle("GET", "/job-ads", s.getAllJobAds)
	mux.Handle("GET", "/job-ads/{slug}", s.getJobAdBySlug)

	mux.Handle("GET", "/banner", s.getBanner)

	mux.Handle("GET", "/static-info", s.getAllStaticInfo)
	mux.Handle("GET", "/static-info/{slug}", s.getStaticInfoBySlug)

	mux.Handle("GET", "/merch", s.getAllMerch)
	mux.Handle("GET", "/merch/{slug}", s.getMerchBySlug)

	mux.Handle("GET", "/minutes", s.getAllMeetingMinutes)
	mux.Handle("GET", "/minutes/{id}", s.getMeetingMinuteById)

	mux.Handle("GET", "/movies", s.getAllMovies)
	mux.Handle("GET", "/movies/upcoming", s.getUpcomingMovies)

	mux.Handle("GET", "/hs-applications", s.getAllHSApplications)

	return mux
}

// handleWebhook processes incoming webhooks from Sanity. It uses the data to update the database accordingly.
// @Summary	     Process Sanity webhook
// @Tags         sanity
// @Accept       json
// @Produce      json
// @Success      200  {object}  map[string]string  "Success"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Router       /sanity/webhook [get]
func (s *sanityCMS) handleWebhook(ctx *handler.Context) error {
	var req dto.SanityWebhookRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.Error(fmt.Errorf("failed to parse request body: %w", err), http.StatusBadRequest)
	}

	s.logger.Info(ctx.Context(), "sanity webhook received",
		"operation", req.Operation,
		"document_id", req.DocumentID,
	)

	switch req.Operation {
	case "create", "update", "delete":
		// valid
	default:
		return ctx.Error(fmt.Errorf("unknown operation %s", req.Operation), http.StatusBadRequest)
	}

	// Skip external happenings
	if req.Data != nil && req.Data.HappeningType == "external" {
		return ctx.JSON(map[string]string{
			"message": fmt.Sprintf("Happening with id %s is external. Nothing done.", req.Data.ID),
		})
	}

	// Delete the happening if the operation is "delete".
	if req.Operation == "delete" {
		if err := s.happeningService.HappeningRepo().DeleteHappening(ctx.Context(), req.DocumentID); err != nil {
			return ctx.Error(err, http.StatusInternalServerError)
		}

		return ctx.JSON(map[string]string{
			"status":  "success",
			"message": fmt.Sprintf("Deleted happening with id %s", req.DocumentID),
		})
	}

	if req.Data == nil {
		s.logger.Warn(ctx.Context(), "no data provided")
		return ctx.Error(errors.New("no data provided"), http.StatusBadRequest)
	}

	// Sync the happening for "create" and "update" operations.
	if err := s.happeningService.SyncHappening(ctx.Context(), req.Data.ToServiceData()); err != nil {
		return ctx.Error(err, http.StatusInternalServerError)
	}

	actionStr := "inserted"
	if req.Operation == "update" {
		actionStr = "updated"
	}

	return ctx.JSON(map[string]string{
		"status":  "success",
		"message": fmt.Sprintf("Happening with id %s %s", req.Data.ID, actionStr),
	})
}

// handleRevalidate invalidates the Redis cache for the given Sanity document type.
// @Summary      Revalidate CMS cache
// @Tags         sanity
// @Accept       json
// @Produce      json
// @Success      200  {object}  map[string]string  "Success"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Router       /sanity/revalidate [post]
func (s *sanityCMS) handleRevalidate(ctx *handler.Context) error {
	var req dto.SanityRevalidateRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.Error(fmt.Errorf("failed to parse request body: %w", err), http.StatusBadRequest)
	}

	s.logger.Info(ctx.Context(), "sanity revalidate received", "type", req.Type)

	s.cmsService.InvalidateByType(ctx.Context(), req.Type)

	return ctx.JSON(map[string]string{
		"status":  "success",
		"message": fmt.Sprintf("Revalidated type: %q", req.Type),
	})
}

// getAllHappenings returns all happenings from Sanity CMS
// @Summary      Get all happenings from CMS
// @Tags         sanity
// @Produce      json
// @Success      200  {array}   dto.CMSHappeningDTO  "OK"
// @Failure      500  {string}  string               "Internal Server Error"
// @Router       /sanity/happenings [get]
func (s *sanityCMS) getAllHappenings(ctx *handler.Context) error {
	happenings, err := s.cmsService.GetAllHappenings(ctx.Context())
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
	happening, err := s.cmsService.GetHappeningBySlug(ctx.Context(), slug)
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
// @Param        types[]  query     []string                 false  "Happening types (bedpres, event, external)"
// @Param        n        query     int                      false  "Max number of results (default: 5)"
// @Success      200      {array}   dto.CMSHomeHappeningDTO  "OK"
// @Failure      500      {string}  string                   "Internal Server Error"
// @Router       /sanity/happenings/home [get]
func (s *sanityCMS) getHomeHappenings(ctx *handler.Context) error {
	types := ctx.R.URL.Query()["types[]"]
	if len(types) == 0 {
		types = []string{"bedpres", "event", "external"}
	}

	n := 5
	if nStr, ok := ctx.QueryParam("n"); ok {
		if parsed, err := strconv.Atoi(nStr); err == nil && parsed > 0 {
			n = parsed
		}
	}

	happenings, err := s.cmsService.GetHomeHappenings(ctx.Context(), types, n)
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(happenings)
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
	contacts, err := s.cmsService.GetHappeningContactsBySlug(ctx.Context(), slug)
	if err != nil {
		return ctx.InternalServerError()
	}
	if contacts == nil {
		return ctx.JSON([]dto.CMSContactDTO{})
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
	happenings, err := s.cmsService.GetAllRepeatingHappenings(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(happenings)
}

// getAllPosts returns all posts from Sanity CMS
// @Summary      Get all posts from CMS
// @Tags         sanity
// @Produce      json
// @Param        n  query     int             false  "Max number of results"
// @Success      200  {array}   dto.CMSPostDTO  "OK"
// @Failure      500  {string}  string          "Internal Server Error"
// @Router       /sanity/posts [get]
func (s *sanityCMS) getAllPosts(ctx *handler.Context) error {
	posts, err := s.cmsService.GetAllPosts(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	if nStr, ok := ctx.QueryParam("n"); ok {
		if n, err := strconv.Atoi(nStr); err == nil && n > 0 && n < len(posts) {
			posts = posts[:n]
		}
	}
	return ctx.JSON(posts)
}

// getStudentGroups returns student groups filtered by type from Sanity CMS
// @Summary      Get student groups from CMS
// @Tags         sanity
// @Produce      json
// @Param        type  query     string                  false  "Group type"
// @Success      200   {array}   dto.CMSStudentGroupDTO  "OK"
// @Failure      500   {string}  string                  "Internal Server Error"
// @Router       /sanity/student-groups [get]
func (s *sanityCMS) getStudentGroups(ctx *handler.Context) error {
	groupType, _ := ctx.QueryParam("type")
	groups, err := s.cmsService.GetStudentGroupsByType(ctx.Context(), groupType)
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
	group, err := s.cmsService.GetStudentGroupBySlug(ctx.Context(), slug)
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
// @Param        n  query     int              false  "Max number of results"
// @Success      200  {array}   dto.CMSJobAdDTO  "OK"
// @Failure      500  {string}  string           "Internal Server Error"
// @Router       /sanity/job-ads [get]
func (s *sanityCMS) getAllJobAds(ctx *handler.Context) error {
	ads, err := s.cmsService.GetAllJobAds(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	if nStr, ok := ctx.QueryParam("n"); ok {
		if n, err := strconv.Atoi(nStr); err == nil && n > 0 && n < len(ads) {
			ads = ads[:n]
		}
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
	banner, err := s.cmsService.GetBanner(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	if banner == nil {
		return ctx.JSON(nil)
	}
	if banner.HasExpired() {
		return ctx.JSON(nil)
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
	info, err := s.cmsService.GetAllStaticInfo(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(info)
}

// getAllMerch returns all merch items from Sanity CMS
// @Summary      Get all merch items from CMS
// @Tags         sanity
// @Produce      json
// @Param        n  query     int              false  "Max number of results"
// @Success      200  {array}   dto.CMSMerchDTO  "OK"
// @Failure      500  {string}  string           "Internal Server Error"
// @Router       /sanity/merch [get]
func (s *sanityCMS) getAllMerch(ctx *handler.Context) error {
	merch, err := s.cmsService.GetAllMerch(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	if nStr, ok := ctx.QueryParam("n"); ok {
		if n, err := strconv.Atoi(nStr); err == nil && n > 0 && n < len(merch) {
			merch = merch[:n]
		}
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
	minutes, err := s.cmsService.GetAllMeetingMinutes(ctx.Context())
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
	movies, err := s.cmsService.GetAllMovies(ctx.Context())
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
	applications, err := s.cmsService.GetAllHSApplications(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(applications)
}

func (s *sanityCMS) getRepeatingHappeningBySlug(ctx *handler.Context) error {
	slug := ctx.PathValue("slug")
	happening, err := s.cmsService.GetRepeatingHappeningBySlug(ctx.Context(), slug)
	if err != nil {
		return ctx.InternalServerError()
	}
	if happening == nil {
		return ctx.NotFound(errors.New("repeating happening not found"))
	}
	return ctx.JSON(happening)
}

func (s *sanityCMS) getPostBySlug(ctx *handler.Context) error {
	slug := ctx.PathValue("slug")
	post, err := s.cmsService.GetPostBySlug(ctx.Context(), slug)
	if err != nil {
		return ctx.InternalServerError()
	}
	if post == nil {
		return ctx.NotFound(errors.New("post not found"))
	}
	return ctx.JSON(post)
}

func (s *sanityCMS) getMerchBySlug(ctx *handler.Context) error {
	slug := ctx.PathValue("slug")
	merch, err := s.cmsService.GetMerchBySlug(ctx.Context(), slug)
	if err != nil {
		return ctx.InternalServerError()
	}
	if merch == nil {
		return ctx.NotFound(errors.New("merch not found"))
	}
	return ctx.JSON(merch)
}

func (s *sanityCMS) getJobAdBySlug(ctx *handler.Context) error {
	slug := ctx.PathValue("slug")
	ad, err := s.cmsService.GetJobAdBySlug(ctx.Context(), slug)
	if err != nil {
		return ctx.InternalServerError()
	}
	if ad == nil {
		return ctx.NotFound(errors.New("job ad not found"))
	}
	return ctx.JSON(ad)
}

func (s *sanityCMS) getStaticInfoBySlug(ctx *handler.Context) error {
	slug := ctx.PathValue("slug")
	info, err := s.cmsService.GetStaticInfoBySlug(ctx.Context(), slug)
	if err != nil {
		return ctx.InternalServerError()
	}
	if info == nil {
		return ctx.NotFound(errors.New("static info not found"))
	}
	return ctx.JSON(info)
}

func (s *sanityCMS) getMeetingMinuteById(ctx *handler.Context) error {
	id := ctx.PathValue("id")
	minute, err := s.cmsService.GetMeetingMinuteById(ctx.Context(), id)
	if err != nil {
		return ctx.InternalServerError()
	}
	if minute == nil {
		return ctx.NotFound(errors.New("meeting minute not found"))
	}
	return ctx.JSON(minute)
}

func (s *sanityCMS) getUpcomingMovies(ctx *handler.Context) error {
	n := 5
	if nStr, ok := ctx.QueryParam("n"); ok {
		if parsed, err := strconv.Atoi(nStr); err == nil && parsed > 0 {
			n = parsed
		}
	}
	movies, err := s.cmsService.GetUpcomingMovies(ctx.Context(), n)
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(movies)
}

func (s *sanityCMS) getFilteredHappenings(ctx *handler.Context) error {
	search, _ := ctx.QueryParam("search")
	happeningType, _ := ctx.QueryParam("type")
	openStr, _ := ctx.QueryParam("open")
	pastStr, _ := ctx.QueryParam("past")

	filter := service.CMSHappeningFilter{
		Search: search,
		Type:   happeningType,
		Open:   openStr == "true",
		Past:   pastStr == "true",
	}

	fromStrs := ctx.R.URL.Query()["from[]"]
	toStrs := ctx.R.URL.Query()["to[]"]
	for _, s := range fromStrs {
		if s == "" {
			filter.DateFrom = append(filter.DateFrom, time.Time{})
		} else if t, err := time.Parse(time.RFC3339, s); err == nil {
			filter.DateFrom = append(filter.DateFrom, t)
		}
	}
	for _, s := range toStrs {
		if s == "" {
			filter.DateTo = append(filter.DateTo, time.Time{})
		} else if t, err := time.Parse(time.RFC3339, s); err == nil {
			filter.DateTo = append(filter.DateTo, t)
		}
	}

	happenings, err := s.cmsService.GetFilteredHappenings(ctx.Context(), filter)
	if err != nil {
		return ctx.InternalServerError()
	}
	return ctx.JSON(happenings)
}
