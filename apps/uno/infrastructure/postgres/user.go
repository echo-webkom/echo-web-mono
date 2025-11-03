package postgres

import (
	"context"
	"time"
	"uno/domain/model"
	"uno/domain/ports"

	"github.com/lib/pq"
)

type UserRepo struct {
	db     *Database
	logger ports.Logger
}

func NewUserRepo(db *Database, logger ports.Logger) ports.UserRepo {
	return &UserRepo{db: db, logger: logger}
}

func (u *UserRepo) GetBannedUsers(ctx context.Context) ([]ports.UserWithBanInfo, error) {
	u.logger.Info(ctx, "getting banned users")

	// First, get all banned users with their ban info
	banQuery := `--sql
		SELECT
			u.id, u.name, u.image,
			b.id AS ban_id, b.reason AS ban_reason, b.user_id AS ban_user_id,
			b.banned_by AS ban_banned_by_id, banned_by_user.name AS ban_banned_by_name,
			b.created_at AS ban_created_at, b.expires_at AS ban_expires_at
		FROM "user" u
		JOIN ban_info b ON u.id = b.user_id
		LEFT JOIN "user" banned_by_user ON b.banned_by = banned_by_user.id;
	`

	rows, err := u.db.QueryContext(ctx, banQuery)
	if err != nil {
		u.logger.Error(ctx, "failed to get banned users",
			"error", err,
		)
		return nil, err
	}
	defer func() { _ = rows.Close() }()

	var users []ports.UserWithBanInfo
	userMap := make(map[string]*ports.UserWithBanInfo)

	for rows.Next() { // Fix n+1 queyr
		var user ports.UserWithBanInfo
		err := rows.Scan(
			&user.ID,
			&user.Name,
			&user.Image,
			&user.BanInfo.ID,
			&user.BanInfo.Reason,
			&user.BanInfo.UserID,
			&user.BanInfo.BannedByID,
			&user.BanInfo.BannedByName,
			&user.BanInfo.CreatedAt,
			&user.BanInfo.ExpiresAt,
		)
		if err != nil {
			return nil, err
		}
		user.Dots = []ports.DotInfo{}
		users = append(users, user)
		userMap[user.ID] = &users[len(users)-1]
	}

	if len(users) == 0 {
		return users, nil
	}

	// Now get all dots for these banned users
	userIDs := make([]string, 0, len(users))
	for _, user := range users {
		userIDs = append(userIDs, user.ID)
	}

	dotQuery := `--sql
		SELECT
			d.id, d.user_id, d.count, d.reason, d.created_at, d.expires_at,
			d.striked_by AS striked_by_id, striked_by_user.name AS striked_by_name
		FROM dot d
		LEFT JOIN "user" striked_by_user ON d.striked_by = striked_by_user.id
		WHERE d.user_id = ANY($1)
		ORDER BY d.user_id, d.created_at DESC;
	`

	var dots []ports.DotInfo
	err = u.db.SelectContext(ctx, &dots, dotQuery, pq.Array(userIDs))
	if err != nil {
		u.logger.Error(ctx, "failed to get dots for banned users",
			"error", err,
		)
		return nil, err
	}

	// Group dots by user ID
	for _, dot := range dots {
		if user, exists := userMap[dot.UserID]; exists {
			user.Dots = append(user.Dots, dot)
		}
	}

	return users, nil
}

func (u *UserRepo) GetUsersWithStrikes(ctx context.Context) (users []ports.UserWithStrikes, err error) {
	u.logger.Info(ctx, "getting users with strikes")

	users = []ports.UserWithStrikes{}
	query := `--sql
		SELECT
			u.id, u.name, u.image,
			COALESCE(b.is_banned, false) AS isbanned,
			COALESCE(d.strike_count, 0) AS strikes
		FROM "user" u
		LEFT JOIN (
			SELECT user_id, COUNT(*) AS strike_count
			FROM dot
			GROUP BY user_id
		) d ON u.id = d.user_id
		LEFT JOIN (
			SELECT user_id, TRUE AS is_banned
			FROM ban_info
		) b ON u.id = b.user_id;
	`

	err = u.db.SelectContext(ctx, &users, query)
	if err != nil {
		u.logger.Error(ctx, "failed to get users with strikes",
			"error", err,
		)
	}
	return users, nil
}

func (u *UserRepo) GetUserByID(ctx context.Context, id string) (user model.User, err error) {
	u.logger.Info(ctx, "getting user by ID",
		"user_id", id,
	)

	query := `--sql
		SELECT
			id, name, email, image, alternative_email, degree_id, year, type,
			last_sign_in_at, updated_at, created_at, has_read_terms,
			birthday, is_public
		FROM "user"
		WHERE id = $1
	`
	err = u.db.GetContext(ctx, &user, query, id)
	if err != nil {
		u.logger.Error(ctx, "failed to get user by ID",
			"error", err,
			"user_id", id,
		)
	}
	return user, nil
}

func (u *UserRepo) GetUsersByIDs(ctx context.Context, ids []string) (users []model.User, err error) {
	u.logger.Info(ctx, "getting users by IDs",
		"user_ids", ids,
	)

	users = []model.User{}
	query := `--sql
		SELECT
			id, name, email, image, alternative_email, degree_id, year, type,
			last_sign_in_at, updated_at, created_at, has_read_terms,
			birthday, is_public
		FROM "user"
		WHERE id IN ($1)
	`
	err = u.db.SelectContext(ctx, &users, query, pq.Array(ids))
	if err != nil {
		u.logger.Error(ctx, "failed to get users by IDs",
			"error", err,
			"user_ids", ids,
		)
	}
	return users, nil
}

func (u *UserRepo) GetUsersWithBirthday(ctx context.Context, date time.Time) (users []model.User, err error) {
	u.logger.Info(ctx, "getting users with birthday",
		"date", date,
	)

	users = []model.User{}
	query := `--sql
		SELECT
			id, name, email, image, alternative_email, degree_id, year, type,
			last_sign_in_at, updated_at, created_at, has_read_terms,
			birthday, is_public
		FROM "user"
		WHERE birthday IS NOT NULL
			AND EXTRACT(MONTH FROM birthday) = EXTRACT(MONTH FROM $1::date)
			AND EXTRACT(DAY FROM birthday) = EXTRACT(DAY FROM $1::date)
	`
	err = u.db.SelectContext(ctx, &users, query, date)
	if err != nil {
		u.logger.Error(ctx, "failed to get users with birthday",
			"error", err,
			"date", date,
		)
	}
	return users, nil
}

func (u *UserRepo) GetUserMemberships(ctx context.Context, userID string) (groupIDs []string, err error) {
	u.logger.Info(ctx, "getting user memberships",
		"user_id", userID,
	)

	groupIDs = []string{}
	query := `--sql
		SELECT group_id
		FROM users_to_groups
		WHERE user_id = $1
	`
	err = u.db.SelectContext(ctx, &groupIDs, query, userID)
	if err != nil {
		u.logger.Error(ctx, "failed to get user memberships",
			"error", err,
			"user_id", userID,
		)
	}
	return groupIDs, nil
}

func (u *UserRepo) CreateUser(ctx context.Context, user model.User) (model.User, error) {
	u.logger.Info(ctx, "creating user",
		"email", user.Email,
		"name", user.Name,
	)

	query := `--sql
		INSERT INTO "user" (id, email, name, image, alternative_email, degree_id, year, type, has_read_terms, birthday, is_public)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING id, name, email, image, alternative_email, degree_id, year, type, last_sign_in_at, updated_at, created_at, has_read_terms, birthday, is_public
	`
	var result model.User
	err := u.db.GetContext(ctx, &result, query,
		user.Email,
		user.Name,
		user.Image,
		user.AlternativeEmail,
		user.DegreeID,
		user.Year,
		user.Type,
		user.HasReadTerms,
		user.Birthday,
		user.IsPublic,
	)
	if err != nil {
		u.logger.Error(ctx, "failed to create user",
			"error", err,
		)
	}
	return result, nil
}
