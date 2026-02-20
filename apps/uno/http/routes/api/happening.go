package api

import (
	"errors"
	"fmt"
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/http/dto"
	"uno/http/handler"
	"uno/http/router"

	_ "uno/domain/model"
)

type happenings struct {
	logger           port.Logger
	happeningService *service.HappeningService
}

func NewHappeningMux(logger port.Logger, happeningService *service.HappeningService, admin handler.Middleware) *router.Mux {
	mux := router.NewMux()
	h := happenings{logger, happeningService}

	mux.Handle("GET", "/", h.GetHappeningsHandler)
	mux.Handle("GET", "/{id}", h.GetHappeningById)
	mux.Handle("GET", "/{id}/registrations/count", h.GetHappeningRegistrationsCount)
	mux.Handle("GET", "/registrations/count", h.GetHappeningRegistrationsCountMany)
	mux.Handle("GET", "/{id}/questions", h.GetHappeningQuestions)

	// Admin
	mux.Handle("GET", "/{id}/spot-ranges", h.GetHappeningSpotRanges, admin)
	mux.Handle("GET", "/{id}/registrations", h.GetHappeningRegistrations, admin)
	mux.Handle("POST", "/{id}/register", h.RegisterForHappening, admin)

	return mux
}

// GetHappeningsHandler returns all happenings
// @Summary	     Get all happenings
// @Description  Retrives a list of all happenings and returns them in a JSON array.
// @Tags         happenings
// @Produce      json
// @Success      200  {array}  dto.HappeningResponse  "OK"
// @Router       /happenings [get]
func (h *happenings) GetHappeningsHandler(ctx *handler.Context) error {
	// Fetch all happenings from the repository
	haps, err := h.happeningService.HappeningRepo().GetAllHappenings(ctx.Context())
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert domain models to DTOs
	response := dto.HappeningListFromDomain(haps)
	return ctx.JSON(response)
}

// GetHappeningById returns a happening by its ID
// @Summary	     Get happening by ID
// @Description  Retrieves a specific happening by its unique identifier.
// @Tags         happenings
// @Produce      json
// @Param        id   path      string  true  "Happening ID"
// @Success      200  {object}  dto.HappeningResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Router       /happenings/{id} [get]
func (h *happenings) GetHappeningById(ctx *handler.Context) error {
	// Extract the happening ID from the URL path
	id := ctx.PathValue("id")

	// Fetch the happening from the repository
	hap, err := h.happeningService.HappeningRepo().GetHappeningById(ctx.Context(), id)
	if err != nil {
		return ctx.Error(errors.New("happening not found"), http.StatusNotFound)
	}

	// Convert domain model to DTO
	response := new(dto.HappeningResponse).FromDomain(&hap)
	return ctx.JSON(response)
}

// GetHappeningRegistrationsCount returns the count of registrations for a happening
// @Summary	     Get happening registrations count
// @Description  Retrieves the count of registrations for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   path      string  true  "Happening ID"
// @Success      200  {object}  dto.GroupedRegistration  "OK"
// @Failure      400  {string}  string "Bad Request"
// @Failure      404  {string}  string "Not Found"
// @Router       /happenings/{id}/registrations/count [get]
// @deprecated
func (h *happenings) GetHappeningRegistrationsCount(ctx *handler.Context) error {
	// Extract the happening ID from the URL path
	id := ctx.PathValue("id")

	grp, err := h.happeningService.GetRegisterCount(ctx.Context(), id)
	if err != nil {
		return ctx.Error(err, http.StatusInternalServerError)
	}

	dtoGrp := (dto.GroupedRegistration{}).FromDomain(grp)
	return ctx.JSON(dtoGrp)
}

// GetHappeningRegistrationsCountMany returns the count of registrations for a happenings
// @Summary	     Get happenings registrations count
// @Description  Retrieves the count of registrations for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   query     string  true  "Happening ID"
// @Success      200  {array}  model.GroupedRegistrationCount  "OK"
// @Failure      400  {string}  string "Bad Request"
// @Failure      404  {string}  string "Not Found"
// @Router       /happenings/registrations/count [get]
func (h *happenings) GetHappeningRegistrationsCountMany(ctx *handler.Context) error {
	// Extract the happening IDs from the URL query parameters
	queryParams := ctx.R.URL.Query()
	ids := queryParams["id"]

	// If no IDs are provided, return bad request
	if len(ids) == 0 {
		return ctx.Error(fmt.Errorf("missing happening ids"), http.StatusBadRequest)
	}

	// Fetch the registration counts from the repository
	counts, err := h.happeningService.HappeningRepo().GetHappeningRegistrationCounts(ctx.Context(), ids)
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert domain models to DTOs
	response := dto.GroupedRegistrationCountFromDomain(counts)
	return ctx.JSON(response)
}

// GetHappeningRegistrations returns all registrations for a happening
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
func (h *happenings) GetHappeningRegistrations(ctx *handler.Context) error {
	// Extract the happening ID from the URL path
	id := ctx.PathValue("id")

	// Fetch the registrations from the repository
	regs, err := h.happeningService.HappeningRepo().GetHappeningRegistrations(ctx.Context(), id)
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert ports models to DTOs
	response := dto.HappeningRegistrationListFromPorts(regs)
	return ctx.JSON(response)
}

// GetHappeningSpotRanges returns all spot ranges for a happening
// @Summary	     Get happening spot ranges
// @Description  Retrieves all spot ranges for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   path     string  true  "Happening ID"
// @Success      200  {array}  dto.SpotRangeResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Security     AdminAPIKey
// @Router       /happenings/{id}/spot-ranges [get]
func (h *happenings) GetHappeningSpotRanges(ctx *handler.Context) error {
	// Extract the happening ID from the URL path
	id := ctx.PathValue("id")

	// Fetch the spot ranges from the repository
	ranges, err := h.happeningService.HappeningRepo().GetHappeningSpotRanges(ctx.Context(), id)
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert domain models to DTOs
	response := dto.SpotRangeListFromDomain(ranges)
	return ctx.JSON(response)
}

// GetHappeningQuestions returns all questions for a happening
// @Summary	     Get happening questions
// @Description  Retrieves all questions for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   path      string  true  "Happening ID"
// @Success      200  {array}   dto.QuestionResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Router       /happenings/{id}/questions [get]
func (h *happenings) GetHappeningQuestions(ctx *handler.Context) error {
	// Extract the happening ID from the URL path
	id := ctx.PathValue("id")

	// Fetch the questions from the repository
	qs, err := h.happeningService.HappeningRepo().GetHappeningQuestions(ctx.Context(), id)
	if err != nil {
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert domain models to DTOs
	response := dto.QuestionListFromDomain(qs)
	return ctx.JSON(response)
}

// RegisterForHappening handles user registration for a happening
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
func (h *happenings) RegisterForHappening(ctx *handler.Context) error {
	// Extract the happening ID from the URL path
	happeningID := ctx.PathValue("id")

	// Parse request DTO
	var req dto.RegisterForHappeningRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.Error(fmt.Errorf("bad json data"), http.StatusBadRequest)
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
		return ctx.Error(ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert domain result to DTO response
	response := dto.RegisterForHappeningResponse{
		Success:      result.Success,
		Message:      result.Message,
		IsWaitlisted: result.IsWaitlisted,
	}

	return ctx.JSON(response)
}
