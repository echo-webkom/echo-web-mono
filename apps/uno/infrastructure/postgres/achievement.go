package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
)

type AchievementRepo struct {
	db *Database
	logger port.Logger
}

func NewAchievementRepo(db *Database, logger port.Logger) port.AchievementRepo {
	return &AchievementRepo{db: db, logger: logger}
}

func (a AchievementRepo) GetAchievements(ctx context.Context , userID string) (model.Achievement, error) {
	a.logger.Info(ctx, "getting user achievements by userID", "user_id", userID)

	// Attendence was introduced on 24th of september 2026. All users registered to bedpres before are considered attended.
	query := `--sql
		SELECT COUNT(*) AS bedpres_count
  		FROM registration AS r 
  		LEFT JOIN happening as h ON h.id = r.happening_id
  		WHERE h.type = 'bedpres' AND r.status = 'registered' AND (attended = TRUE OR r.created_at <= '2026-9-23') AND r.user_id = $1
	`

	var achievement record.Achievement

	err := a.db.GetContext(ctx, &achievement, query, userID)

	if err != nil {
		a.logger.Error(ctx, "failed to get achievements by user ID", "error", err, "user_id", userID)
		return model.Achievement{}, err
	}

	return achievement.ToDomain(), nil

}