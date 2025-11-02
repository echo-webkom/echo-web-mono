package api

import (
	"fmt"
	"net/http"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
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
func GetHappeningsHandler(hs *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		haps, err := hs.HappeningRepo().GetAllHappenings(r.Context())
		if err != nil {
			return http.StatusInternalServerError, err
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
func GetHappeningById(hs *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		hap, err := hs.HappeningRepo().GetHappeningById(r.Context(), id)
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
func GetHappeningRegistrationsCount(hs *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		ctx := r.Context()

		hap, err := hs.HappeningRepo().GetHappeningById(ctx, id)
		if err != nil {
			return http.StatusNotFound, err
		}

		spotRanges, err := hs.HappeningRepo().GetHappeningSpotRanges(ctx, hap.ID)
		if err != nil {
			return http.StatusInternalServerError, err
		}

		regs, err := hs.HappeningRepo().GetHappeningRegistrations(ctx, hap.ID)
		if err != nil {
			return http.StatusInternalServerError, err
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
func GetHappeningRegistrations(hs *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		regs, err := hs.HappeningRepo().GetHappeningRegistrations(ctx, id)
		if err != nil {
			return http.StatusNotFound, err
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
func GetHappeningSpotRanges(hs *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		ranges, err := hs.HappeningRepo().GetHappeningSpotRanges(ctx, id)
		if err != nil {
			return http.StatusNotFound, err
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
func GetHappeningQuestions(hs *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		qs, err := hs.HappeningRepo().GetHappeningQuestions(ctx, id)
		if err != nil {
			return http.StatusNotFound, err
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
func RegisterForHappening(hs *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		var req services.RegisterRequest
		if err := util.ReadJson(r, &req); err != nil {
			return http.StatusBadRequest, fmt.Errorf("invalid request body: %w", err)
		}

		resp, err := hs.Register(r.Context(), id, req)
		if err != nil {
			return http.StatusInternalServerError, err
		}

		// If registration was not successful, return 400
		if resp != nil && !resp.Success {
			return util.Json(w, http.StatusBadRequest, resp)
		}

		// Successful registration
		return util.JsonOk(w, resp)
	}
}
