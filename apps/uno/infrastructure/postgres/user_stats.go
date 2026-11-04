package postgres

import (
	"context"
	"uno/domain/model"
	"uno/domain/port"
)

type UserStatsRepo struct {
	db     *Database
	logger port.Logger
}

func (u *UserStatsRepo) GetUserStats(ctx context.Context, userID string) (model.UserStats, error) {
	userBedpresAttendences, err := u.getUserBedpresAttendences(ctx, userID)

	if err != nil {
		u.logger.Error(ctx, "failed to get user stats", "error", err, "user_id", userID)
		return model.UserStats{}, err
	}

	return model.UserStats{BedpresCount: userBedpresAttendences}, nil
}

func NewUserStatsRepo(db *Database, logger port.Logger) port.UserStatsRepo {
	return &UserStatsRepo{db: db, logger: logger}
}

const userBedpresAttendencesQuery = `--sql
		SELECT COUNT(*) AS bedpres_count
  		FROM registration AS r 
  		JOIN happening AS h ON h.id = r.happening_id
  		WHERE h.type = 'bedpres'
  			AND r.status = 'registered'
  			AND (r.attended = TRUE OR r.created_at <= DATE '2026-09-23')
  			AND r.user_id = $1
	`

func (u *UserStatsRepo) getUserBedpresAttendences(ctx context.Context, userID string) (int, error) {
	u.logger.Info(ctx, "getting user bedpres attendences")

	var userBedpresAttendences int

	err := u.db.GetContext(ctx, &userBedpresAttendences, userBedpresAttendencesQuery, userID)

	if err != nil {
		u.logger.Error(ctx, "failed to get user bedpres attendances", "error", err, "user_id", userID)
		return 0, err
	}

	return userBedpresAttendences, nil

}
