package api

import (
	"net/http"
	"uno/data/model"
	"uno/http/util"
)

type HappeningRepo interface {
	GetAllHappenings() ([]model.Happening, error)
}

func GetHappeningsHandler(repo HappeningRepo) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		haps, err := repo.GetAllHappenings()
		if err != nil {
			http.Error(w, "failed to fetch happenings", http.StatusInternalServerError)
			return
		}

		util.JSON(w, http.StatusOK, haps)
	}
}
