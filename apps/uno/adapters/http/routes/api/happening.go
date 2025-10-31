package api

import (
	"fmt"
	"net/http"
	"uno/adapters/http/router"
	"uno/adapters/http/util"
	"uno/services"
)

func GetHappeningsHandler(hs *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		haps, err := hs.GetAllHappenings(r.Context())
		if err != nil {
			return http.StatusInternalServerError, err
		}

		return util.JsonOk(w, haps)
	}
}

func GetHappeningById(hs *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		hap, err := hs.GetHappeningById(r.Context(), id)
		if err != nil {
			return http.StatusNotFound, err
		}

		return util.JsonOk(w, hap)
	}
}

func GetHappeningRegistrationsCount(hs *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		ctx := r.Context()

		hap, err := hs.GetHappeningById(ctx, id)
		if err != nil {
			return http.StatusNotFound, err
		}

		spotRanges, err := hs.GetHappeningSpotRanges(ctx, hap.ID)
		if err != nil {
			return http.StatusInternalServerError, err
		}

		regs, err := hs.GetHappeningRegistrations(ctx, hap.ID)
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

func GetHappeningRegistrations(hs *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		regs, err := hs.GetHappeningRegistrations(ctx, id)
		if err != nil {
			return http.StatusNotFound, err
		}

		return util.JsonOk(w, regs)
	}
}

func GetHappeningSpotRanges(hs *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		ranges, err := hs.GetHappeningRegistrations(ctx, id)
		if err != nil {
			return http.StatusNotFound, err
		}

		return util.JsonOk(w, ranges)
	}
}

func GetHappeningQuestions(hs *services.HappeningService) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		qs, err := hs.GetHappeningQuestions(ctx, id)
		if err != nil {
			return http.StatusNotFound, err
		}

		return util.JsonOk(w, qs)
	}
}
