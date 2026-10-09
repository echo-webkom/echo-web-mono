package record

import "uno/domain/model"

type Achievement struct {
	BedpresCount int `db:"bedpres_count"`
}

func (h Achievement) ToDomain() model.Achievement {
	return model.Achievement{
		BedpresCount: h.BedpresCount,
	}
}