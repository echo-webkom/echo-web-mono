package api

import (
	"errors"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"
)

type happenings struct {
	logger           port.Logger
	happeningService *service.HappeningService
}

func NewHappeningMux(logger port.Logger, happeningService *service.HappeningService, admin handler.Middleware) *router.Mux {
	mux := router.NewMux()
	h := happenings{logger, happeningService}

	mux.GET("/", h.getHappenings)
	mux.GET("/{id}", h.getHappeningById)
	mux.GET("/registrations/count", h.getHappeningRegistrationsCountMany)
	mux.GET("/{id}/questions", h.getHappeningQuestions)
	mux.GET("/{id}/spot-ranges", h.getHappeningSpotRanges)

	// Admin
	mux.GET("/{id}/registrations", h.getHappeningRegistrations, admin)
	mux.GET("/{id}/registrations/{userId}", h.getHappeningRegistrationByUser, admin)
	mux.GET("/{id}/registrations/full", h.getHappeningRegistrationsFull, admin)
	mux.GET("/{slug}/full", h.getFullHappeningBySlug, admin)
	mux.POST("/{id}/register", h.registerForHappening, admin)
	mux.POST("/{id}/deregister", h.deregisterFromHappening, admin)
	mux.PATCH("/{id}/registrations/{userId}", h.updateRegistrationStatus, admin)
	mux.DELETE("/{id}/registrations", h.deleteAllRegistrations, admin)

	return mux
}

// getHappenings returns all happenings
// @Summary	     Get all happenings
// @Description  Retrives a list of all happenings and returns them in a JSON array.
// @Tags         happenings
// @Produce      json
// @Success      200  {array}  dto.HappeningResponse  "OK"
// @Router       /happenings [get]
func (h *happenings) getHappenings(ctx *handler.Context) error {
	// Fetch all happenings from the repository
	haps, err := h.happeningService.GetAllHappenings(ctx.Context())
	if err != nil {
		return ctx.InternalServerError()
	}

	// Convert domain models to DTOs
	response := dto.HappeningListFromDomain(haps)
	return ctx.JSON(response)
}

// getHappeningById returns a happening by its ID
// @Summary	     Get happening by ID
// @Description  Retrieves a specific happening by its unique identifier.
// @Tags         happenings
// @Produce      json
// @Param        id   path      string  true  "Happening ID"
// @Success      200  {object}  dto.HappeningResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Router       /happenings/{id} [get]
func (h *happenings) getHappeningById(ctx *handler.Context) error {
	// Extract the happening ID from the URL path
	id := ctx.PathValue("id")
	if id == "" {
		return ctx.BadRequest(errors.New("missing happening ID"))
	}

	// Fetch the happening from the repository
	hap, err := h.happeningService.GetHappeningByID(ctx.Context(), id)
	if err != nil {
		return ctx.NotFound(errors.New("happening not found"))
	}

	// Convert domain model to DTO
	response := new(dto.HappeningResponse).FromDomain(&hap)
	return ctx.JSON(response)
}

// getHappeningRegistrationsCountMany returns the count of registrations for a happenings
// @Summary	     Get happenings registrations count
// @Description  Retrieves the count of registrations for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   query     string  true  "Happening ID"
// @Success      200  {array}  dto.RegistrationCount  "OK"
// @Failure      400  {string}  string "Bad Request"
// @Failure      404  {string}  string "Not Found"
// @Router       /happenings/registrations/count [get]
func (h *happenings) getHappeningRegistrationsCountMany(ctx *handler.Context) error {
	// Extract the happening IDs from the URL query parameters
	queryParams := ctx.R.URL.Query()
	ids := queryParams["id"]

	// If no IDs are provided, return bad request
	if len(ids) == 0 {
		return ctx.BadRequest(errors.New("missing happenings IDs"))
	}

	// Fetch the registration counts from the repository
	counts, err := h.happeningService.GetHappeningRegistrationCounts(ctx.Context(), ids)
	if err != nil {
		return ctx.InternalServerError()
	}

	// Convert domain models to DTOs
	response := dto.RegistrationCountsFromDomain(counts)
	return ctx.JSON(response)
}

// getHappeningRegistrations returns all registrations for a happening
// @Summary	     Get happening registrations
// @Description  Retrieves all registrations for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   path     string  true  "Happening ID"
// @Success      200  {array}  dto.HappeningRegistrationResponse  "OK"
// @Failure      400  {string}  string   "Bad Request"
// @Failure      404  {string}  string   "Not Found"
// @Security     AdminAPIKey
// @Router       /happenings/{id}/registrations [get]
func (h *happenings) getHappeningRegistrations(ctx *handler.Context) error {
	// Extract the happening ID from the URL path
	id := ctx.PathValue("id")
	if id == "" {
		return ctx.BadRequest(errors.New("missing happening ID"))
	}

	// Fetch the registrations from the repository
	regs, err := h.happeningService.GetHappeningRegistrations(ctx.Context(), id)
	if err != nil {
		return ctx.InternalServerError()
	}

	// Convert ports models to DTOs
	response := dto.HappeningRegistrationListFromPorts(regs)
	return ctx.JSON(response)
}

// getHappeningRegistrationByUser returns the registration of a specific user for a happening
// @Summary      Get registration by user
// @Description  Retrieves the registration of a specific user for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id      path      string  true  "Happening ID"
// @Param        userId  path      string  true  "User ID"
// @Success      200     {object}  dto.RegistrationResponse  "OK"
// @Failure      400     {string}  string  "Bad Request"
// @Failure      404     {string}  string  "Not Found"
// @Security     AdminAPIKey
// @Router       /happenings/{id}/registrations/{userId} [get]
func (h *happenings) getHappeningRegistrationByUser(ctx *handler.Context) error {
	happeningID := ctx.PathValue("id")
	if happeningID == "" {
		return ctx.BadRequest(errors.New("missing happening ID"))
	}

	userID := ctx.PathValue("userId")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user ID"))
	}

	reg, err := h.happeningService.GetRegistrationByUserAndHappening(ctx.Context(), userID, happeningID)
	if err != nil {
		return ctx.InternalServerError()
	}
	if reg == nil {
		return ctx.NotFound(errors.New("registration not found"))
	}

	response := new(dto.RegistrationResponse).FromDomain(*reg)
	return ctx.JSON(response)
}

// getHappeningRegistrationsFull returns full registration rows for a happening by ID.
// @Summary      Get full happening registrations
// @Description  Retrieves full registration rows for a specific happening, enriched with user information.
// @Tags         happenings
// @Produce      json
// @Param        id   path      string  true  "Happening ID"
// @Success      200  {array}   dto.FullRegistrationRowResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /happenings/{id}/registrations/full [get]
func (h *happenings) getHappeningRegistrationsFull(ctx *handler.Context) error {
	id := ctx.PathValue("id")
	if id == "" {
		return ctx.BadRequest(errors.New("missing happening ID"))
	}

	happening, err := h.happeningService.GetHappeningByID(ctx.Context(), id)
	if err != nil {
		return ctx.NotFound(errors.New("happening not found"))
	}

	fullHappening, err := h.happeningService.GetFullHappeningBySlug(ctx.Context(), happening.Slug)
	if err != nil {
		return ctx.InternalServerError()
	}

	userIDs := make(map[string]struct{})
	for _, reg := range fullHappening.Registrations {
		userIDs[reg.UserID] = struct{}{}
		if reg.ChangedBy != nil {
			userIDs[*reg.ChangedBy] = struct{}{}
		}
	}

	ids := make([]string, 0, len(userIDs))
	for id := range userIDs {
		ids = append(ids, id)
	}

	usersByID := make(map[string]model.User)
	if len(ids) > 0 {
		users, userErr := h.happeningService.GetUsersByIDs(ctx.Context(), ids)
		if userErr != nil {
			return ctx.InternalServerError()
		}
		for _, user := range users {
			usersByID[user.ID] = user
		}
	}

	rows := dto.FullRegistrationRowsFromDomain(fullHappening, usersByID)
	return ctx.JSON(rows)
}

// getHappeningSpotRanges returns all spot ranges for a happening
// @Summary	     Get happening spot ranges
// @Description  Retrieves all spot ranges for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   path     string  true  "Happening ID"
// @Success      200  {array}  dto.SpotRangeResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Router       /happenings/{id}/spot-ranges [get]
func (h *happenings) getHappeningSpotRanges(ctx *handler.Context) error {
	// Extract the happening ID from the URL path
	id := ctx.PathValue("id")
	if id == "" {
		return ctx.BadRequest(errors.New("missing happening ID"))
	}

	// Fetch the spot ranges from the repository
	ranges, err := h.happeningService.GetHappeningSpotRanges(ctx.Context(), id)
	if err != nil {
		return ctx.InternalServerError()
	}

	// Convert domain models to DTOs
	response := dto.SpotRangeListFromDomain(ranges)
	return ctx.JSON(response)
}

// getHappeningQuestions returns all questions for a happening
// @Summary	     Get happening questions
// @Description  Retrieves all questions for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   path      string  true  "Happening ID"
// @Success      200  {array}   dto.QuestionResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Router       /happenings/{id}/questions [get]
func (h *happenings) getHappeningQuestions(ctx *handler.Context) error {
	// Extract the happening ID from the URL path
	id := ctx.PathValue("id")
	if id == "" {
		return ctx.BadRequest(errors.New("missing happening ID"))
	}

	// Fetch the questions from the repository
	qs, err := h.happeningService.GetHappeningQuestions(ctx.Context(), id)
	if err != nil {
		return ctx.InternalServerError()
	}

	// Convert domain models to DTOs
	response := dto.QuestionListFromDomain(qs)
	return ctx.JSON(response)
}

// getFullHappeningBySlug returns a happening with all related data by slug
// @Summary      Get full happening by slug
// @Description  Retrieves a happening by slug with registrations (including answers and user info), questions, and host groups.
// @Tags         happenings
// @Produce      json
// @Param        slug  path      string  true  "Happening slug"
// @Success      200   {object}  dto.FullHappeningResponse  "OK"
// @Failure      400   {string}  string  "Bad Request"
// @Failure      404   {string}  string  "Not Found"
// @Security     AdminAPIKey
// @Router       /happenings/{slug}/full [get]
func (h *happenings) getFullHappeningBySlug(ctx *handler.Context) error {
	slug := ctx.PathValue("slug")
	if slug == "" {
		return ctx.BadRequest(errors.New("missing happening slug"))
	}

	fullHappening, err := h.happeningService.GetFullHappeningBySlug(ctx.Context(), slug)
	if err != nil {
		return ctx.NotFound(errors.New("happening not found"))
	}

	return ctx.JSON(dto.FullHappeningFromDomain(fullHappening))
}

// registerForHappening handles user registration for a happening
// @Summary	     Register for happening
// @Description  Registers a user for a specific happening with business logic validation
// @Tags         happenings
// @Accept       json
// @Produce      json
// @Param        id    path      string                               true  "Happening ID"
// @Param        body  body      dto.RegisterForHappeningRequest      true  "Registration request"
// @Success      200   {object}  dto.RegisterForHappeningResponse     "OK"
// @Failure      400   {object}  dto.RegisterForHappeningResponse     "Bad Request"
// @Failure      500   {object}  dto.RegisterForHappeningResponse     "Internal Server Error"
// @Security     BearerAuth
// @Router       /happenings/{id}/register [post]
func (h *happenings) registerForHappening(ctx *handler.Context) error {
	// Extract the happening ID from the URL path
	happeningID := ctx.PathValue("id")
	if happeningID == "" {
		return ctx.BadRequest(errors.New("missing happening ID"))
	}

	// Parse request DTO
	var req dto.RegisterForHappeningRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	// Convert DTO to domain models
	questions := dto.QuestionAnswerListToDomain(req.Questions)

	// Call service with domain models
	result, err := h.happeningService.Register(
		ctx.Context(),
		req.UserID,
		happeningID,
		questions,
	)
	if err != nil {
		return ctx.InternalServerError()
	}

	// Convert domain result to DTO response
	response := dto.RegisterForHappeningResponse{
		Success:      result.Success,
		Message:      result.Message,
		IsWaitlisted: result.IsWaitlisted,
	}

	h.logger.Info(ctx.Context(), "registration attempt",
		"userID", req.UserID,
		"happeningID", happeningID,
		"success", result.Success,
		"waitlisted", result.IsWaitlisted,
		"message", result.Message,
	)

	return ctx.JSON(response)
}

// deregisterFromHappening deregisters a user from a happening.
// @Summary      Deregister from happening
// @Description  Marks a user's registration as unregistered and deletes their answers.
// @Tags         happenings
// @Accept       json
// @Produce      json
// @Param        id    path      string             true  "Happening ID"
// @Param        body  body      dto.DeregisterRequest  true  "Deregistration payload"
// @Success      200   {string}  string             "OK"
// @Failure      400   {string}  string             "Bad Request"
// @Failure      401   {string}  string             "Unauthorized"
// @Failure      404   {string}  string             "Not Found"
// @Failure      500   {string}  string             "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /happenings/{id}/deregister [post]
func (h *happenings) deregisterFromHappening(ctx *handler.Context) error {
	happeningID := ctx.PathValue("id")
	if happeningID == "" {
		return ctx.BadRequest(errors.New("missing happening ID"))
	}

	var req dto.DeregisterRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}
	if req.UserID == "" {
		return ctx.BadRequest(errors.New("missing user ID"))
	}

	if err := h.happeningService.Deregister(ctx.Context(), req.UserID, happeningID, req.Reason); err != nil {
		if errors.Is(err, service.ErrRegistrationNotFound) {
			return ctx.NotFound(errors.New("registration not found"))
		}
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}

// updateRegistrationStatus updates a user's registration status for a happening.
// @Summary      Update registration status
// @Description  Updates status and metadata for a user's registration in a specific happening.
// @Tags         happenings
// @Accept       json
// @Produce      json
// @Param        id      path      string                           true  "Happening ID"
// @Param        userId  path      string                           true  "User ID"
// @Param        body    body      dto.UpdateRegistrationStatusRequest  true  "Registration status payload"
// @Success      200     {string}  string                           "OK"
// @Failure      400     {string}  string                           "Bad Request"
// @Failure      401     {string}  string                           "Unauthorized"
// @Failure      404     {string}  string                           "Not Found"
// @Failure      500     {string}  string                           "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /happenings/{id}/registrations/{userId} [patch]
func (h *happenings) updateRegistrationStatus(ctx *handler.Context) error {
	happeningID := ctx.PathValue("id")
	if happeningID == "" {
		return ctx.BadRequest(errors.New("missing happening ID"))
	}

	userID := ctx.PathValue("userId")
	if userID == "" {
		return ctx.BadRequest(errors.New("missing user ID"))
	}

	var req dto.UpdateRegistrationStatusRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.BadRequest(ErrFailedToReadJSON)
	}

	validStatuses := map[string]model.RegistrationStatus{
		"registered":   model.RegistrationStatusRegistered,
		"waiting":      model.RegistrationStatusWaitlisted,
		"unregistered": model.RegistrationStatusUnregistered,
		"removed":      model.RegistrationStatusRemoved,
		"pending":      model.RegistrationStatusPending,
	}
	status, ok := validStatuses[req.Status]
	if !ok {
		return ctx.BadRequest(errors.New("invalid status"))
	}

	reg, err := h.happeningService.GetRegistrationByUserAndHappening(ctx.Context(), userID, happeningID)
	if err != nil {
		return ctx.InternalServerError()
	}
	if reg == nil {
		return ctx.NotFound(errors.New("registration not found"))
	}

	now := time.Now()
	changedBy := req.ChangedBy
	if err = h.happeningService.UpdateRegistrationStatus(
		ctx.Context(),
		userID,
		happeningID,
		status,
		stringPtr(string(reg.Status)),
		&changedBy,
		&now,
		&req.Reason,
	); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}

// deleteAllRegistrations deletes all registrations for a happening by ID.
// @Summary      Delete all happening registrations
// @Tags         happenings
// @Param        id   path      string  true  "Happening ID"
// @Success      200  {string}  string  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      401  {string}  string  "Unauthorized"
// @Failure      500  {string}  string  "Internal Server Error"
// @Security     AdminAPIKey
// @Router       /happenings/{id}/registrations [delete]
func (h *happenings) deleteAllRegistrations(ctx *handler.Context) error {
	happeningID := ctx.PathValue("id")
	if happeningID == "" {
		return ctx.BadRequest(errors.New("missing happening ID"))
	}

	if err := h.happeningService.DeleteRegistrationsByHappeningID(ctx.Context(), happeningID); err != nil {
		return ctx.InternalServerError()
	}

	return ctx.Ok()
}

func stringPtr(s string) *string {
	return &s
}
