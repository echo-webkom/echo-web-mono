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

func NewUserStatsRepo(db *Database, logger port.Logger) port.UserStatsRepo {
	return &UserStatsRepo{db: db, logger: logger}
}

// A registration counts if the user is registered and has attended. Attendance
// was not tracked before 2026-09-23, so older registrations count as attended.
const userStatsQuery = `--sql
	SELECT
		COUNT(*) FILTER (WHERE h.type = 'bedpres') AS bedpres_count,
		COUNT(*) FILTER (WHERE h.title ~* '\mgo[- ]?kart') AS gokart_count
	FROM registration AS r
	JOIN happening AS h ON h.id = r.happening_id
	WHERE r.status = 'registered'
		AND (r.attended = TRUE OR r.created_at <= DATE '2026-09-23')
		AND r.user_id = $1
`

func (u *UserStatsRepo) GetUserStats(ctx context.Context, userID string) (model.UserStats, error) {
	u.logger.Info(ctx, "getting user stats", "user_id", userID)

	var stats struct {
		BedpresCount int `db:"bedpres_count"`
		GokartCount  int `db:"gokart_count"`
	}

	if err := u.db.GetContext(ctx, &stats, userStatsQuery, userID); err != nil {
		u.logger.Error(ctx, "failed to get user stats", "error", err, "user_id", userID)
		return model.UserStats{}, err
	}

	return model.UserStats{
		BedpresCount: stats.BedpresCount,
		GokartCount:  stats.GokartCount,
	}, nil
}
