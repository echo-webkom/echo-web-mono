package happening

import (
	"errors"
	"fmt"
	"net/http"
	"uno/domain/port"
	"uno/domain/service"
	"uno/pkg/uno"

	_ "uno/domain/model"
)

type happenings struct {
	logger           port.Logger
	happeningService *service.HappeningService
}

func NewMux(logger port.Logger, happeningService *service.HappeningService, admin uno.Middleware) *uno.Mux {
	mux := uno.NewMux()
	h := happenings{logger, happeningService}

	mux.Handle("GET", "/", h.getHappenings)
	mux.Handle("GET", "/{id}", h.getHappeningById)
	mux.Handle("GET", "/{id}/registrations/count", h.getHappeningRegistrationsCount)
	mux.Handle("GET", "/registrations/count", h.getHappeningRegistrationsCountMany)
	mux.Handle("GET", "/{id}/questions", h.getHappeningQuestions)

	// Admin
	mux.Handle("GET", "/{id}/spot-ranges", h.getHappeningSpotRanges, admin)
	mux.Handle("GET", "/{id}/registrations", h.getHappeningRegistrations, admin)
	mux.Handle("POST", "/{id}/register", h.registerForHappening, admin)

	return mux
}

// getHappenings returns all happenings
// @Summary	     Get all happenings
// @Description  Retrives a list of all happenings and returns them in a JSON array.
// @Tags         happenings
// @Produce      json
// @Success      200  {array}  HappeningResponse  "OK"
// @Router       /happenings [get]
func (h *happenings) getHappenings(ctx *uno.Context) error {
	// Fetch all happenings from the repository
	haps, err := h.happeningService.HappeningRepo().GetAllHappenings(ctx.Context())
	if err != nil {
		return ctx.Error(uno.ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert domain models to DTOs
	response := HappeningListFromDomain(haps)
	return ctx.JSON(response)
}

// getHappeningById returns a happening by its ID
// @Summary	     Get happening by ID
// @Description  Retrieves a specific happening by its unique identifier.
// @Tags         happenings
// @Produce      json
// @Param        id   path      string  true  "Happening ID"
// @Success      200  {object}  HappeningResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Router       /happenings/{id} [get]
func (h *happenings) getHappeningById(ctx *uno.Context) error {
	// Extract the happening ID from the URL path
	id := ctx.PathValue("id")

	// Fetch the happening from the repository
	hap, err := h.happeningService.HappeningRepo().GetHappeningById(ctx.Context(), id)
	if err != nil {
		return ctx.Error(errors.New("happening not found"), http.StatusNotFound)
	}

	// Convert domain model to DTO
	response := new(HappeningResponse).FromDomain(&hap)
	return ctx.JSON(response)
}

// getHappeningRegistrationsCount returns the count of registrations for a happening
// @Summary	     Get happening registrations count
// @Description  Retrieves the count of registrations for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   path      string  true  "Happening ID"
// @Success      200  {object}  RegistrationCount  "OK"
// @Failure      400  {string}  string "Bad Request"
// @Failure      404  {string}  string "Not Found"
// @Router       /happenings/{id}/registrations/count [get]
// @deprecated
func (h *happenings) getHappeningRegistrationsCount(ctx *uno.Context) error {
	// Extract the happening ID from the URL path
	id := ctx.PathValue("id")

	grp, err := h.happeningService.GetRegisterCount(ctx.Context(), id)
	if err != nil {
		return ctx.Error(err, http.StatusInternalServerError)
	}

	dtoGrp := (RegistrationCount{}).FromDomain(grp)
	return ctx.JSON(dtoGrp)
}

// getHappeningRegistrationsCountMany returns the count of registrations for a happenings
// @Summary	     Get happenings registrations count
// @Description  Retrieves the count of registrations for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   query     string  true  "Happening ID"
// @Success      200  {array}  RegistrationCount  "OK"
// @Failure      400  {string}  string "Bad Request"
// @Failure      404  {string}  string "Not Found"
// @Router       /happenings/registrations/count [get]
func (h *happenings) getHappeningRegistrationsCountMany(ctx *uno.Context) error {
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
		return ctx.Error(uno.ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert domain models to DTOs
	response := RegistrationCountsFromDomain(counts)
	return ctx.JSON(response)
}

// getHappeningRegistrations returns all registrations for a happening
// @Summary	     Get happening registrations
// @Description  Retrieves all registrations for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   path     string  true  "Happening ID"
// @Success      200  {array}  HappeningRegistrationResponse  "OK"
// @Failure      400  {string}  string   "Bad Request"
// @Failure      404  {string}  string   "Not Found"
// @Security     AdminAPIKey
// @Router       /happenings/{id}/registrations [get]
func (h *happenings) getHappeningRegistrations(ctx *uno.Context) error {
	// Extract the happening ID from the URL path
	id := ctx.PathValue("id")

	// Fetch the registrations from the repository
	regs, err := h.happeningService.HappeningRepo().GetHappeningRegistrations(ctx.Context(), id)
	if err != nil {
		return ctx.Error(uno.ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert ports models to DTOs
	response := HappeningRegistrationListFromPorts(regs)
	return ctx.JSON(response)
}

// getHappeningSpotRanges returns all spot ranges for a happening
// @Summary	     Get happening spot ranges
// @Description  Retrieves all spot ranges for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   path     string  true  "Happening ID"
// @Success      200  {array}  SpotRangeResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Security     AdminAPIKey
// @Router       /happenings/{id}/spot-ranges [get]
func (h *happenings) getHappeningSpotRanges(ctx *uno.Context) error {
	// Extract the happening ID from the URL path
	id := ctx.PathValue("id")

	// Fetch the spot ranges from the repository
	ranges, err := h.happeningService.HappeningRepo().GetHappeningSpotRanges(ctx.Context(), id)
	if err != nil {
		return ctx.Error(uno.ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert domain models to DTOs
	response := SpotRangeListFromDomain(ranges)
	return ctx.JSON(response)
}

// getHappeningQuestions returns all questions for a happening
// @Summary	     Get happening questions
// @Description  Retrieves all questions for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   path      string  true  "Happening ID"
// @Success      200  {array}   QuestionResponse  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Router       /happenings/{id}/questions [get]
func (h *happenings) getHappeningQuestions(ctx *uno.Context) error {
	// Extract the happening ID from the URL path
	id := ctx.PathValue("id")

	// Fetch the questions from the repository
	qs, err := h.happeningService.HappeningRepo().GetHappeningQuestions(ctx.Context(), id)
	if err != nil {
		return ctx.Error(uno.ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert domain models to DTOs
	response := QuestionListFromDomain(qs)
	return ctx.JSON(response)
}

// registerForHappening handles user registration for a happening
// @Summary	     Register for happening
// @Description  Registers a user for a specific happening with business logic validation
// @Tags         happenings
// @Accept       json
// @Produce      json
// @Param        id    path      string                               true  "Happening ID"
// @Param        body  body      RegisterForHappeningRequest      true  "Registration request"
// @Success      200   {object}  RegisterForHappeningResponse     "OK"
// @Failure      400   {object}  RegisterForHappeningResponse     "Bad Request"
// @Failure      500   {object}  RegisterForHappeningResponse     "Internal Server Error"
// @Security     BearerAuth
// @Router       /happenings/{id}/register [post]
func (h *happenings) registerForHappening(ctx *uno.Context) error {
	// Extract the happening ID from the URL path
	happeningID := ctx.PathValue("id")

	// Parse request DTO
	var req RegisterForHappeningRequest
	if err := ctx.ReadJSON(&req); err != nil {
		return ctx.Error(fmt.Errorf("bad json data"), http.StatusBadRequest)
	}

	// Convert DTO to domain models
	questions := QuestionAnswerListToDomain(req.Questions)

	// Call service with domain models
	result, err := h.happeningService.Register(
		ctx.Context(),
		req.UserID,
		happeningID,
		questions,
	)

	if err != nil {
		return ctx.Error(uno.ErrInternalServer, http.StatusInternalServerError)
	}

	// Convert domain result to DTO response
	response := RegisterForHappeningResponse{
		Success:      result.Success,
		Message:      result.Message,
		IsWaitlisted: result.IsWaitlisted,
	}

	return ctx.JSON(response)
}
