package api

import (
	"errors"
	"fmt"
	"net/http"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
	"uno/domain/ports"
	"uno/domain/services"

	_ "uno/domain/model"
)

// GetHappeningsHandler returns all happenings
// @Summary	     Get all happenings
// @Description  Retrives a list of all happenings and returns them in a JSON array.
// @Tags         happenings
// @Produce      json
// @Success      200  {array}  model.Happening  "OK"
// @Router       /happenings [get]
func GetHappeningsHandler(logger ports.Logger, happeningService *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		haps, err := happeningService.HappeningRepo().GetAllHappenings(r.Context())
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		return util.JsonOk(w, haps)
	}
}

// GetHappeningById returns a happening by its ID
// @Summary	     Get happening by ID
// @Description  Retrieves a specific happening by its unique identifier.
// @Tags         happenings
// @Produce      json
// @Param        id   path      string  true  "Happening ID"
// @Success      200  {object}  model.Happening  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Router       /happenings/{id} [get]
func GetHappeningById(logger ports.Logger, happeningService *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing happening id")
		}

		hap, err := happeningService.HappeningRepo().GetHappeningById(r.Context(), id)
		if err != nil {
			return http.StatusNotFound, err
		}

		return util.JsonOk(w, hap)
	}
}

// GetHappeningRegistrationsCount returns the count of registrations for a happening
// @Summary	     Get happening registrations count
// @Description  Retrieves the count of registrations for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   path      string  true  "Happening ID"
// @Success      200  {object}  GroupedRegistration  "OK"
// @Failure      400  {string}  string "Bad Request"
// @Failure      404  {string}  string "Not Found"
// @Router       /happenings/{id}/registrations/count [get]
// @deprecated
func GetHappeningRegistrationsCount(logger ports.Logger, happeningService *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing happening id")
		}

		ctx := r.Context()

		hap, err := happeningService.HappeningRepo().GetHappeningById(ctx, id)
		if err != nil {
			return http.StatusNotFound, ErrInternalServer
		}

		spotRanges, err := happeningService.HappeningRepo().GetHappeningSpotRanges(ctx, hap.ID)
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		regs, err := happeningService.HappeningRepo().GetHappeningRegistrations(ctx, hap.ID)
		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		grp := GroupedRegistration{}

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
func GetHappeningRegistrationsCountMany(logger ports.Logger, happeningService *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		queryParams := r.URL.Query()
		ids := queryParams["id"]
		if len(ids) == 0 {
			return http.StatusBadRequest, fmt.Errorf("missing happening ids")
		}

		ctx := r.Context()
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
// @Success      200  {array}  model.Registration  "OK"
// @Failure      400  {string}  string   "Bad Request"
// @Failure      404  {string}  string   "Not Found"
// @Security     AdminAPIKey
// @Router       /happenings/{id}/registrations [get]
func GetHappeningRegistrations(logger ports.Logger, happeningService *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing happening id")
		}

		regs, err := happeningService.HappeningRepo().GetHappeningRegistrations(ctx, id)
		if err != nil {
			return http.StatusNotFound, ErrInternalServer
		}

		return util.JsonOk(w, regs)
	}
}

// GetHappeningSpotRanges returns all spot ranges for a happening
// @Summary	     Get happening spot ranges
// @Description  Retrieves all spot ranges for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   path     string  true  "Happening ID"
// @Success      200  {array}  model.SpotRange  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Security     AdminAPIKey
// @Router       /happenings/{id}/spot-ranges [get]
func GetHappeningSpotRanges(logger ports.Logger, happeningService *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing happening id")
		}

		ranges, err := happeningService.HappeningRepo().GetHappeningSpotRanges(ctx, id)
		if err != nil {
			return http.StatusNotFound, ErrInternalServer
		}

		return util.JsonOk(w, ranges)
	}
}

// GetHappeningQuestions returns all questions for a happening
// @Summary	     Get happening questions
// @Description  Retrieves all questions for a specific happening.
// @Tags         happenings
// @Produce      json
// @Param        id   path      string  true  "Happening ID"
// @Success      200  {array}   model.Question  "OK"
// @Failure      400  {string}  string  "Bad Request"
// @Failure      404  {string}  string  "Not Found"
// @Router       /happenings/{id}/questions [get]
func GetHappeningQuestions(logger ports.Logger, happeningService *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing happening id")
		}

		qs, err := happeningService.HappeningRepo().GetHappeningQuestions(ctx, id)
		if err != nil {
			return http.StatusNotFound, ErrInternalServer
		}

		return util.JsonOk(w, qs)
	}
}

// RegisterForHappening handles user registration for a happening
// @Summary	     Register for happening
// @Description  Registers a user for a specific happening with business logic validation
// @Tags         happenings
// @Accept       json
// @Produce      json
// @Param        id    path      string                      true  "Happening ID"
// @Param        body  body      services.RegisterRequest    true  "Registration request"
// @Success      200   {object}  services.RegisterResponse   "OK"
// @Failure      400   {object}  services.RegisterResponse   "Bad Request"
// @Failure      500   {object}  services.RegisterResponse   "Internal Server Error"
// @Router       /happenings/{id}/register [post]
func RegisterForHappening(logger ports.Logger, happeningService *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing happening id")
		}

		var req services.RegisterRequest
		if err := util.ReadJson(r, &req); err != nil {
			return http.StatusBadRequest, errors.New("failed to read json")
		}

		resp, err := happeningService.Register(r.Context(), id, req)

		if err != nil {
			return http.StatusInternalServerError, ErrInternalServer
		}

		return util.JsonOk(w, resp)
	}
}
