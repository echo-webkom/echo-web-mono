package api

import (
	"context"
	"log"
	"net/http"
	"uno/data/model"
	"uno/http/util"
)

type HappeningRepo interface {
	GetAllHappenings(ctx context.Context) ([]model.Happening, error)
}

func GetHappeningsHandler(repo HappeningRepo) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		haps, err := repo.GetAllHappenings(r.Context())
		if err != nil {
			log.Println(err)
			http.Error(w, "failed to fetch happenings", http.StatusInternalServerError)
			return
		}

		util.JSON(w, http.StatusOK, haps)
	}
}
