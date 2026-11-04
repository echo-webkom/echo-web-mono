package sanityinfra

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/pkg/sanity"
)

type TrophyRepo struct {
	client *sanity.Client
	logger port.Logger
}

type sanityTrophy struct {
	Title        string              `json:"title"`
	TrophyLevels []sanityTrophyLevel `json:"trophyLevels"`
}

type sanityTrophyLevel struct {
	Image     string `json:"image"`
	Name      string `json:"name"`
	Text      string `json:"text"`
	Threshold int    `json:"threshold"`
}

func NewTrophyRepo(client *sanity.Client, logger port.Logger) port.TrophyRepo {
	return &TrophyRepo{
		client: client,
		logger: logger,
	}
}

const allTrophiesQuery = `
*[_type == "trophy" && !(_id in path('drafts.**'))] | order(_createdAt desc) {
  title,
  "trophyLevels": trophyLevels[] {
    "image": image.asset->url,
    name,
    text,
    threshold
  }
}
`

func (t *TrophyRepo) GetAllTrophies(ctx context.Context) ([]model.Trophy, error) {
	t.logger.Info(ctx, "getting all trophies")

	result, err := sanity.Query[[]sanityTrophy](ctx, t.client, allTrophiesQuery, nil)
	if err != nil {
		t.logger.Error(ctx, "failed to get all trophies", "error", err)
		return nil, err
	}

	trophies := make([]model.Trophy, len(result))
	for i, trophy := range result {
		levels := make([]model.TrophyLevel, len(trophy.TrophyLevels))
		for j, level := range trophy.TrophyLevels {
			levels[j] = model.TrophyLevel{
				Image:     level.Image,
				Name:      level.Name,
				Text:      level.Text,
				Threshold: level.Threshold,
			}
		}
		trophies[i] = model.Trophy{
			Title:        trophy.Title,
			TrophyLevels: levels,
		}
	}

	return trophies, nil
}
