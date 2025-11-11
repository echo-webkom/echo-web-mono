package api

import (
	"errors"
	"fmt"
	"net/http"
	"uno/adapters/http/dto"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
	"uno/domain/ports"
	"uno/domain/service"

	_ "uno/domain/model"
)

// GetHappeningsHandler returns all happenings
// @Summary	     Get all happenings
// @Description  Retrives a list of all happenings and returns them in a JSON array.
// @Tags         happenings
// @Produce      json
// @Success      200  {array}  dto.HappeningResponse  "OK"
// @Router       /happenings [get]
func GetHappeningsHandler(logger ports.Logger, happeningService *service.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		// Fetch all happenings from the repository
		haps, err := happeningService.HappeningRepo().GetAllHappenings(ctx)
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		// Convert domain models to DTOs
		response := dto.HappeningListFromDomain(haps)

		return util.JsonOk(w, response)
	}
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
func GetHappeningById(logger ports.Logger, happeningService *service.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		// Extract the happening ID from the URL path
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing happening id")
		}

		// Fetch the happening from the repository
		hap, err := happeningService.HappeningRepo().GetHappeningById(ctx, id)
		if err != nil {
			return http.StatusNotFound, err
		}

		// Convert domain model to DTO
		response := new(dto.HappeningResponse).FromDomain(&hap)

		return util.JsonOk(w, response)
	}
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
func GetHappeningRegistrationsCount(logger ports.Logger, happeningService *service.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		// Extract the happening ID from the URL path
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing happening id")
		}

		// Fetch the happening from the repository
		hap, err := happeningService.HappeningRepo().GetHappeningById(ctx, id)
		if err != nil {
			return http.StatusNotFound, ErrInternalServer
		}

		// Fetch spot ranges
		spotRanges, err := happeningService.HappeningRepo().GetHappeningSpotRanges(ctx, hap.ID)
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		// Fetch registrations
		// TODO: Aggregate directly in SQL query
		regs, err := happeningService.HappeningRepo().GetHappeningRegistrations(ctx, hap.ID)
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		// Aggregate registration counts
		// - Max spots from spot ranges
		// - Count of registered and waiting registrations
		grp := dto.GroupedRegistration{}
		if len(spotRanges) > 0 {
			count := 0
			for _, spot := range spotRanges {
				count += spot.Spots
			}
			grp.Max = &count
		}

		for _, reg := range regs {
			switch reg.Status {
			case "waiting":
				grp.Waiting++
			case "registered":
				grp.Registered++
			}
		}

		return util.JsonOk(w, grp)
	}
}

// GetHappeningRegistrationsCountMany returns the count of registrations for a happenings
// @Summary	     Get happenings registrations count
// @Description  Retrieves the count of registrations for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   query     string  true  "Happening ID"
// @Success      200  {array}  ports.GroupedRegistrationCount  "OK"
// @Failure      400  {string}  string "Bad Request"
// @Failure      404  {string}  string "Not Found"
// @Router       /happenings/registrations/count [get]
func GetHappeningRegistrationsCountMany(logger ports.Logger, happeningService *service.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		// Extract the happening IDs from the URL query parameters
		queryParams := r.URL.Query()
		ids := queryParams["id"]

		// If no IDs are provided, return bad request
		if len(ids) == 0 {
			return http.StatusBadRequest, fmt.Errorf("missing happening ids")
		}

		// Fetch the registration counts from the repository
		counts, err := happeningService.HappeningRepo().GetHappeningRegistrationCounts(ctx, ids)
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		return util.JsonOk(w, counts)
	}
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
func GetHappeningRegistrations(logger ports.Logger, happeningService *service.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		// Extract the happening ID from the URL path
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing happening id")
		}

		// Fetch the registrations from the repository
		regs, err := happeningService.HappeningRepo().GetHappeningRegistrations(ctx, id)
		if err != nil {
			return http.StatusNotFound, ErrInternalServer
		}

		// Convert ports models to DTOs
		response := dto.HappeningRegistrationListFromPorts(regs)

		return util.JsonOk(w, response)
	}
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
func GetHappeningSpotRanges(logger ports.Logger, happeningService *service.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		// Extract the happening ID from the URL path
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing happening id")
		}

		// Fetch the spot ranges from the repository
		ranges, err := happeningService.HappeningRepo().GetHappeningSpotRanges(ctx, id)
		if err != nil {
			return http.StatusNotFound, ErrInternalServer
		}

		// Convert domain models to DTOs
		response := dto.SpotRangeListFromDomain(ranges)

		return util.JsonOk(w, response)
	}
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
func GetHappeningQuestions(logger ports.Logger, happeningService *service.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		// Extract the happening ID from the URL path
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing happening id")
		}

		// Fetch the questions from the repository
		qs, err := happeningService.HappeningRepo().GetHappeningQuestions(ctx, id)
		if err != nil {
			return http.StatusNotFound, ErrInternalServer
		}

		// Convert domain models to DTOs
		response := dto.QuestionListFromDomain(qs)

		return util.JsonOk(w, response)
	}
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
func RegisterForHappening(logger ports.Logger, happeningService *service.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		// Extract the happening ID from the URL path
		happeningID := r.PathValue("id")
		if happeningID == "" {
			return http.StatusBadRequest, fmt.Errorf("missing happening id")
		}

		// Parse request DTO
		var req dto.RegisterForHappeningRequest
		if err := util.ReadJson(r, &req); err != nil {
			return http.StatusBadRequest, errors.New("failed to read json")
		}

		// Convert DTO to domain models
		questions := dto.QuestionAnswerListToDomain(req.Questions)

		// Call service with domain models
		result, err := happeningService.Register(
			ctx,
			req.UserID,
			happeningID,
			questions,
		)

		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		// Convert domain result to DTO response
		response := dto.RegisterForHappeningResponse{
			Success:      result.Success,
			Message:      result.Message,
			IsWaitlisted: result.IsWaitlisted,
		}

		return util.JsonOk(w, response)
	}
}
