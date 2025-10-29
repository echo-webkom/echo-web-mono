package api

import (
	"context"
	"fmt"
	"net/http"
	"uno/data/model"
	"uno/http/router"
	"uno/http/util"
)

type HappeningRepo interface {
	GetAllHappenings(ctx context.Context) ([]model.Happening, error)
	GetHappeningById(ctx context.Context, id string) (model.Happening, error)
	GetSpotRangesByHappeningId(ctx context.Context, hapId string) ([]model.SpotRange, error)
	GetRegistrationsByHappeningId(ctx context.Context, hapId string) ([]model.Registration, error)
	GetQuestionsByHappeningId(ctx context.Context, hapId string) ([]model.Question, error)
}

func GetHappeningsHandler(repo HappeningRepo) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		haps, err := repo.GetAllHappenings(r.Context())
		if err != nil {
			return http.StatusInternalServerError, err
		}

		return util.JsonOk(w, haps)
	}
}

func GetHappeningById(repo HappeningRepo) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		hap, err := repo.GetHappeningById(r.Context(), id)
		if err != nil {
			return http.StatusNotFound, err
		}

		return util.JsonOk(w, hap)
	}
}

type GroupedRegistration struct {
	Waiting    int  `json:"waiting"`
	Registered int  `json:"registered"`
	Max        *int `json:"max"`
}

func GetHappeningRegistrationsCount(repo HappeningRepo) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		ctx := r.Context()

		hap, err := repo.GetHappeningById(ctx, id)
		if err != nil {
			return http.StatusNotFound, err
		}

		spotRanges, err := repo.GetSpotRangesByHappeningId(ctx, hap.ID)
		if err != nil {
			return http.StatusInternalServerError, err
		}

		regs, err := repo.GetRegistrationsByHappeningId(ctx, hap.ID)
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

func GetHappeningRegistrations(repo HappeningRepo) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		regs, err := repo.GetRegistrationsByHappeningId(ctx, id)
		if err != nil {
			return http.StatusNotFound, err
		}

		return util.JsonOk(w, regs)
	}
}

func GetHappeningSpotRanges(repo HappeningRepo) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		ranges, err := repo.GetSpotRangesByHappeningId(ctx, id)
		if err != nil {
			return http.StatusNotFound, err
		}

		return util.JsonOk(w, ranges)
	}
}

func GetHappeningQuestions(repo HappeningRepo) router.Handler {
	return func(w http.ResponseWriter, r *http.Request) (int, error) {
		ctx := r.Context()

		id := r.PathValue("id")
		if id == "" {
			return http.StatusBadRequest, fmt.Errorf("missing id in path")
		}

		qs, err := repo.GetQuestionsByHappeningId(ctx, id)
		if err != nil {
			return http.StatusNotFound, err
		}

		return util.JsonOk(w, qs)
	}
}
