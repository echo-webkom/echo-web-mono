package postgres

import (
	"context"
	"database/sql"
	"fmt"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"

	"github.com/lib/pq"
)

type UserRepo struct {
	db     *Database
	logger port.Logger
}

const baseUserQuery = `--sql
	SELECT
		u.id, u.name, u.email, u.image, u.alternative_email, u.alternative_email_verified_at, u.year, u.type,
		u.last_sign_in_at, u.updated_at, u.created_at, u.has_read_terms,
		u.birthday, u.is_public,
		d.id AS degree_id, d.name AS degree_name
	FROM "user" u
	LEFT JOIN degree d ON u.degree_id = d.id
`

func NewUserRepo(db *Database, logger port.Logger) port.UserRepo {
	return &UserRepo{db: db, logger: logger}
}

func (u *UserRepo) GetAllUsers(ctx context.Context) ([]model.User, error) {
	u.logger.Info(ctx, "getting all users")

	var usersDB []record.UserDB
	query := baseUserQuery
	err := u.db.SelectContext(ctx, &usersDB, query)
	if err != nil {
		u.logger.Error(ctx, "failed to get all users",
			"error", err,
		)
		return []model.User{}, err
	}

	if len(usersDB) == 0 {
		return []model.User{}, nil
	}

	userIDs := make([]string, len(usersDB))
	for i, user := range usersDB {
		userIDs[i] = user.ID
	}

	groupsByUser, err := u.getUserGroups(ctx, userIDs)
	if err != nil {
		return []model.User{}, err
	}

	for i := range usersDB {
		usersDB[i].Groups = groupsByUser[usersDB[i].ID]
	}

	return record.UserToDomainList(usersDB), nil
}

func (u *UserRepo) GetBannedUsers(ctx context.Context) ([]model.UserWithBanInfo, error) {
	u.logger.Info(ctx, "getting banned users")

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

	var users []record.UserWithBanInfo
	userIndexes := make(map[string]int)

	for rows.Next() {
		var user record.UserWithBanInfo
		err = rows.Scan(
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
		user.Dots = []record.DotInfo{}
		users = append(users, user)
		userIndexes[user.ID] = len(users) - 1
	}

	if len(users) == 0 {
		return []model.UserWithBanInfo{}, nil
	}

	// Now get all dots for these banned users
	userIDs := make([]string, 0, len(users))
	for _, user := range users {
		userIDs = append(userIDs, user.ID)
	}

	dots, err := u.getDotsForUsers(ctx, userIDs)
	if err != nil {
		return nil, err
	}

	// Group dots by user ID
	for _, dot := range dots {
		if index, exists := userIndexes[dot.UserID]; exists {
			users[index].Dots = append(users[index].Dots, dot)
		}
	}

	return record.UserWithBanInfoList(users), nil
}

func (u *UserRepo) GetUsersWithStrikes(ctx context.Context) ([]model.UserWithStrikes, error) {
	u.logger.Info(ctx, "getting users with strikes")

	users := []record.UserWithStrikes{}
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

	if err := u.db.SelectContext(ctx, &users, query); err != nil {
		u.logger.Error(ctx, "failed to get users with strikes",
			"error", err,
		)
		return nil, err
	}

	return record.UserWithStrikesList(users), nil
}

func (u *UserRepo) GetUsersWithStrikeDetails(ctx context.Context) ([]model.UserWithStrikeDetails, error) {
	u.logger.Info(ctx, "getting users with strike details")

	query := `--sql
		SELECT
			u.id,
			u.name,
			u.image,
			b.id AS ban_id,
			b.reason AS ban_reason,
			b.user_id AS ban_user_id,
			b.banned_by AS ban_banned_by_id,
			banned_by_user.name AS ban_banned_by_name,
			b.created_at AS ban_created_at,
			b.expires_at AS ban_expires_at
		FROM "user" u
		LEFT JOIN ban_info b ON u.id = b.user_id
		LEFT JOIN "user" banned_by_user ON b.banned_by = banned_by_user.id
		WHERE EXISTS (SELECT 1 FROM dot d WHERE d.user_id = u.id)
		   OR b.id IS NOT NULL;
	`

	rows, err := u.db.QueryContext(ctx, query)
	if err != nil {
		u.logger.Error(ctx, "failed to get users with strike details", "error", err)
		return nil, err
	}
	defer func() { _ = rows.Close() }()

	users := make([]record.UserWithStrikeDetails, 0)
	userIndexes := make(map[string]int)

	for rows.Next() {
		var user record.UserWithStrikeDetails
		var banID *int
		var banReason *string
		var banUserID *string
		var banBannedByID *string
		var banBannedByName *string
		var banCreatedAt *time.Time
		var banExpiresAt *time.Time

		err = rows.Scan(
			&user.ID,
			&user.Name,
			&user.Image,
			&banID,
			&banReason,
			&banUserID,
			&banBannedByID,
			&banBannedByName,
			&banCreatedAt,
			&banExpiresAt,
		)
		if err != nil {
			return nil, err
		}

		if banID != nil {
			reason := ""
			if banReason != nil {
				reason = *banReason
			}

			userID := ""
			if banUserID != nil {
				userID = *banUserID
			}

			bannedByID := ""
			if banBannedByID != nil {
				bannedByID = *banBannedByID
			}

			createdAt := time.Time{}
			if banCreatedAt != nil {
				createdAt = *banCreatedAt
			}

			expiresAt := time.Time{}
			if banExpiresAt != nil {
				expiresAt = *banExpiresAt
			}

			user.BanInfo = &record.BanInfo{
				ID:           *banID,
				Reason:       reason,
				UserID:       userID,
				BannedByID:   bannedByID,
				BannedByName: banBannedByName,
				CreatedAt:    createdAt,
				ExpiresAt:    expiresAt,
			}
		}

		user.Dots = []record.DotInfo{}
		users = append(users, user)
		userIndexes[user.ID] = len(users) - 1
	}

	if len(users) == 0 {
		return []model.UserWithStrikeDetails{}, nil
	}

	userIDs := make([]string, 0, len(users))
	for _, user := range users {
		userIDs = append(userIDs, user.ID)
	}

	dots, err := u.getDotsForUsers(ctx, userIDs)
	if err != nil {
		return nil, err
	}

	for _, dot := range dots {
		if index, exists := userIndexes[dot.UserID]; exists {
			users[index].Dots = append(users[index].Dots, dot)
		}
	}

	return record.UserWithStrikeDetailsList(users), nil
}

func (u *UserRepo) GetUserWithStrikeDetailsByID(ctx context.Context, id string) (*model.UserWithStrikeDetails, error) {
	u.logger.Info(ctx, "getting user with strike details by ID", "user_id", id)

	query := `--sql
		SELECT
			u.id,
			u.name,
			u.image,
			b.id AS ban_id,
			b.reason AS ban_reason,
			b.user_id AS ban_user_id,
			b.banned_by AS ban_banned_by_id,
			banned_by_user.name AS ban_banned_by_name,
			b.created_at AS ban_created_at,
			b.expires_at AS ban_expires_at
		FROM "user" u
		LEFT JOIN ban_info b ON u.id = b.user_id
		LEFT JOIN "user" banned_by_user ON b.banned_by = banned_by_user.id
		WHERE u.id = $1;
	`

	rows, err := u.db.QueryContext(ctx, query, id)
	if err != nil {
		u.logger.Error(ctx, "failed to get user with strike details", "error", err, "user_id", id)
		return nil, err
	}
	defer func() { _ = rows.Close() }()

	var user *record.UserWithStrikeDetails

	for rows.Next() {
		if user == nil {
			user = &record.UserWithStrikeDetails{}
		}

		var banID *int
		var banReason *string
		var banUserID *string
		var banBannedByID *string
		var banBannedByName *string
		var banCreatedAt *time.Time
		var banExpiresAt *time.Time

		err = rows.Scan(
			&user.ID,
			&user.Name,
			&user.Image,
			&banID,
			&banReason,
			&banUserID,
			&banBannedByID,
			&banBannedByName,
			&banCreatedAt,
			&banExpiresAt,
		)
		if err != nil {
			return nil, err
		}

		if banID != nil {
			reason := ""
			if banReason != nil {
				reason = *banReason
			}

			userID := ""
			if banUserID != nil {
				userID = *banUserID
			}

			bannedByID := ""
			if banBannedByID != nil {
				bannedByID = *banBannedByID
			}

			createdAt := time.Time{}
			if banCreatedAt != nil {
				createdAt = *banCreatedAt
			}

			expiresAt := time.Time{}
			if banExpiresAt != nil {
				expiresAt = *banExpiresAt
			}

			user.BanInfo = &record.BanInfo{
				ID:           *banID,
				Reason:       reason,
				UserID:       userID,
				BannedByID:   bannedByID,
				BannedByName: banBannedByName,
				CreatedAt:    createdAt,
				ExpiresAt:    expiresAt,
			}
		}

		user.Dots = []record.DotInfo{}
	}

	if user == nil {
		return nil, nil
	}

	dots, err := u.getDotsForUsers(ctx, []string{user.ID})
	if err != nil {
		u.logger.Error(ctx, "failed to get dots for user", "error", err, "user_id", user.ID)
		return nil, err
	}

	user.Dots = dots

	result := user.ToDomain()
	return result, nil
}

func (u *UserRepo) GetUserByID(ctx context.Context, id string) (model.User, error) {
	u.logger.Info(ctx, "getting user by ID",
		"user_id", id,
	)

	query := baseUserQuery + `WHERE u.id = $1`
	var userDB record.UserDB
	if err := u.db.GetContext(ctx, &userDB, query, id); err != nil {
		u.logger.Error(ctx, "failed to get user by ID",
			"error", err,
			"user_id", id,
		)
		return model.User{}, err
	}

	groupsQuery := `--sql
		SELECT g.id, g.name, utg.is_leader
		FROM users_to_groups utg
		JOIN "group" g ON utg.group_id = g.id
		WHERE utg.user_id = $1
	`
	if err := u.db.SelectContext(ctx, &userDB.Groups, groupsQuery, id); err != nil {
		u.logger.Error(ctx, "failed to get user groups",
			"error", err,
			"user_id", id,
		)
		return model.User{}, err
	}

	user, err := userDB.ToDomain()
	if err != nil {
		return model.User{}, err
	}
	return user, nil
}

func (u *UserRepo) GetUsersByIDs(ctx context.Context, ids []string) ([]model.User, error) {
	u.logger.Info(ctx, "getting users by IDs",
		"user_ids", ids,
	)

	var usersDB []record.UserDB
	query := baseUserQuery + `WHERE u.id = ANY($1)`
	err := u.db.SelectContext(ctx, &usersDB, query, pq.Array(ids))
	if err != nil {
		u.logger.Error(ctx, "failed to get users by IDs",
			"error", err,
			"user_ids", ids,
		)
		return []model.User{}, err
	}

	if len(usersDB) == 0 {
		return []model.User{}, nil
	}

	groupsByUser, err := u.getUserGroups(ctx, ids)
	if err != nil {
		return []model.User{}, err
	}

	for i := range usersDB {
		usersDB[i].Groups = groupsByUser[usersDB[i].ID]
	}

	return record.UserToDomainList(usersDB), nil
}

func (u *UserRepo) GetUsersWithBirthday(ctx context.Context, date time.Time) ([]model.User, error) {
	u.logger.Info(ctx, "getting users with birthday",
		"date", date,
	)

	query := baseUserQuery + `WHERE EXTRACT(MONTH FROM u.birthday) = EXTRACT(MONTH FROM $1::DATE) AND EXTRACT(DAY FROM u.birthday) = EXTRACT(DAY FROM $1::DATE)`
	var usersDB []record.UserDB
	err := u.db.SelectContext(ctx, &usersDB, query, date)
	if err != nil {
		u.logger.Error(ctx, "failed to get users with birthday",
			"error", err,
			"date", date,
		)
		return []model.User{}, err
	}
	return record.UserToDomainList(usersDB), nil
}

func (u *UserRepo) ResetUserYears(ctx context.Context) (int64, error) {
	u.logger.Info(ctx, "resetting user years")

	query := `--sql
		UPDATE "user"
		SET year = NULL
		WHERE year IS NOT NULL
	`
	result, err := u.db.ExecContext(ctx, query)
	if err != nil {
		u.logger.Error(ctx, "failed to reset user years", "error", err)
		return 0, err
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return 0, fmt.Errorf("reset user years rows affected: %w", err)
	}

	return rowsAffected, nil
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
	if err := u.db.SelectContext(ctx, &groupIDs, query, userID); err != nil {
		u.logger.Error(ctx, "failed to get user memberships",
			"error", err,
			"user_id", userID,
		)
		return nil, err
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
		RETURNING id, name, email, image, alternative_email, alternative_email_verified_at, degree_id, year, type, last_sign_in_at, updated_at, created_at, has_read_terms, birthday, is_public
	`
	var degreeID *string
	if user.Degree != nil {
		degreeID = &user.Degree.ID
	}

	var year *int
	if user.Year != nil {
		y := user.Year.Int()
		year = &y
	}

	var resultDB record.UserDB
	err := u.db.GetContext(ctx, &resultDB, query,
		user.Email,
		user.Name,
		nil, // image — always null on creation
		user.AlternativeEmail,
		degreeID,
		year,
		user.Type.String(),
		user.HasReadTerms,
		user.Birthday,
		user.IsPublic,
	)
	if err != nil {
		u.logger.Error(ctx, "failed to create user",
			"error", err,
		)
		return model.User{}, err
	}
	result, err := resultDB.ToDomain()
	if err != nil {
		return model.User{}, err
	}
	return result, nil
}

func (u *UserRepo) SearchUsersByName(ctx context.Context, query string, limit int) ([]model.User, error) {
	u.logger.Info(ctx, "searching users by name", "query", query)

	var usersDB []record.UserDB
	sqlQuery := `--sql
		SELECT id, name, email, image, alternative_email, alternative_email_verified_at, year, type,
			last_sign_in_at, updated_at, created_at, has_read_terms,
			birthday, is_public
		FROM "user"
		WHERE name ILIKE $1
		ORDER BY name ASC
		LIMIT $2
	`
	err := u.db.SelectContext(ctx, &usersDB, sqlQuery, "%"+query+"%", limit)
	if err != nil {
		u.logger.Error(ctx, "failed to search users by name", "error", err)
		return nil, err
	}

	return record.UserToDomainList(usersDB), nil
}

func (u *UserRepo) UpdateUserImage(ctx context.Context, userID string, hasImage bool) error {
	u.logger.Info(ctx, "updating user image",
		"user_id", userID,
		"has_image", hasImage,
	)

	var image *string
	if hasImage {
		marker := "1"
		image = &marker
	}

	query := `--sql
		UPDATE "user"
		SET image = $1, updated_at = NOW()
		WHERE id = $2
	`
	_, err := u.db.ExecContext(ctx, query, image, userID)
	if err != nil {
		u.logger.Error(ctx, "failed to update user image URL",
			"error", err,
			"user_id", userID,
		)
		return err
	}
	return nil
}

func (u *UserRepo) GetUserGroupIDs(ctx context.Context, feideID string) ([]string, error) {
	u.logger.Info(ctx, "getting user group IDs",
		"feide_id", feideID,
	)

	query := `--sql
		SELECT user_id
		FROM "account"
		WHERE provider = 'feide'
			AND provider_account_id = $1
	`
	var userID string
	if err := u.db.GetContext(ctx, &userID, query, feideID); err != nil {
		u.logger.Error(ctx, "failed to get user ID from feide ID",
			"error", err,
			"feide_id", feideID,
		)
		return nil, err
	}

	groupIDs := []string{}
	query = `--sql
		SELECT group_id
		FROM users_to_groups
		WHERE user_id = $1
	`
	if err := u.db.SelectContext(ctx, &groupIDs, query, userID); err != nil {
		u.logger.Error(ctx, "failed to get user group IDs",
			"error", err,
			"user_id", userID,
		)
		return nil, err
	}
	return groupIDs, nil
}

func (u *UserRepo) GetUserByEmail(ctx context.Context, email string) (model.User, error) {
	u.logger.Info(ctx, "getting user by email",
		"email", email,
	)

	query := baseUserQuery + `WHERE u.email = $1 OR u.alternative_email = $1`
	var userDB record.UserDB
	if err := u.db.GetContext(ctx, &userDB, query, email); err != nil {
		u.logger.Error(ctx, "failed to get user by email",
			"error", err,
			"email", email,
		)
		return model.User{}, err
	}

	return userDB.ToDomain()
}

func (u *UserRepo) UpdateUserLastSignIn(ctx context.Context, userID string) error {
	u.logger.Info(ctx, "updating user last sign in",
		"user_id", userID,
	)

	query := `--sql
		UPDATE "user"
		SET last_sign_in_at = NOW()
		WHERE id = $1
	`
	_, err := u.db.ExecContext(ctx, query, userID)
	if err != nil {
		u.logger.Error(ctx, "failed to update user last sign in",
			"error", err,
			"user_id", userID,
		)
		return err
	}
	return nil
}

func (u *UserRepo) CreateUserAndAccount(ctx context.Context, user model.User, account model.NewAccount) (model.User, error) {
	tx, err := u.db.BeginTxx(ctx, &sql.TxOptions{
		Isolation: sql.LevelReadCommitted,
	})
	if err != nil {
		return model.User{}, fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer func() { _ = tx.Rollback() }()

	query := `--sql
		INSERT INTO "user" (id, name, email, image, alternative_email, degree_id, year, type,
		                    last_sign_in_at, updated_at, created_at, has_read_terms,
		                    birthday, is_public)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		RETURNING id, name, email, image, alternative_email, degree_id, year, type,
		          last_sign_in_at, updated_at, created_at, has_read_terms,
		          birthday, is_public
	`
	var userDB record.UserDB
	err = tx.GetContext(ctx, &userDB, query,
		user.ID, user.Name, user.Email, nil, user.AlternativeEmail,
		func() *string {
			if user.Degree != nil {
				return &user.Degree.ID
			}
			return nil
		}(),
		user.Year.IntPtr(), user.Type, user.LastSignInAt,
		user.UpdatedAt, user.CreatedAt, user.HasReadTerms,
		user.Birthday, user.IsPublic,
	)
	if err != nil {
		u.logger.Error(ctx, "failed to create user in transaction",
			"error", err,
			"user_id", user.ID,
		)
		return model.User{}, fmt.Errorf("failed to create user: %w", err)
	}

	accountQuery := `--sql
		INSERT INTO "account" (user_id, type, provider, provider_account_id, refresh_token,
		                      access_token, expires_at, token_type, scope, id_token, session_state)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING user_id, type, provider, provider_account_id, refresh_token, access_token,
		          expires_at, token_type, scope, id_token, session_state
	`
	var accountDB record.AccountDB
	err = tx.GetContext(ctx, &accountDB, accountQuery,
		account.UserID, account.Type, account.Provider, account.ProviderAccountID,
		account.RefreshToken, account.AccessToken, account.ExpiresAt,
		account.TokenType, account.Scope, account.IDToken, account.SessionState,
	)
	if err != nil {
		u.logger.Error(ctx, "failed to create account in transaction",
			"error", err,
			"user_id", account.UserID,
		)
		return model.User{}, fmt.Errorf("failed to create account: %w", err)
	}

	if err := tx.Commit(); err != nil {
		return model.User{}, fmt.Errorf("failed to commit transaction: %w", err)
	}

	return userDB.ToDomain()
}

func (u *UserRepo) getUserGroups(ctx context.Context, userIDs []string) (map[string][]record.GroupDB, error) {
	type groupWithUserID struct {
		UserID string `db:"user_id"`
		record.GroupDB
	}

	groupsQuery := `--sql
		SELECT utg.user_id, g.id, g.name, utg.is_leader
		FROM users_to_groups utg
		JOIN "group" g ON utg.group_id = g.id
		WHERE utg.user_id = ANY($1)
	`
	var groups []groupWithUserID
	if err := u.db.SelectContext(ctx, &groups, groupsQuery, pq.Array(userIDs)); err != nil {
		u.logger.Error(ctx, "failed to get groups for users",
			"error", err,
		)
		return nil, err
	}

	groupsByUser := make(map[string][]record.GroupDB)
	for _, g := range groups {
		groupsByUser[g.UserID] = append(groupsByUser[g.UserID], g.GroupDB)
	}
	return groupsByUser, nil
}

func (u *UserRepo) getDotsForUsers(ctx context.Context, userIDs []string) ([]record.DotInfo, error) {
	dotQuery := `--sql
		SELECT
			d.id, d.user_id, d.count, d.reason, d.created_at, d.expires_at,
			d.striked_by AS striked_by_id, striked_by_user.name AS striked_by_name
		FROM dot d
		LEFT JOIN "user" striked_by_user ON d.striked_by = striked_by_user.id
		WHERE d.user_id = ANY($1)
		ORDER BY d.user_id, d.created_at DESC;
	`
	var dots []record.DotInfo
	if err := u.db.SelectContext(ctx, &dots, dotQuery, pq.Array(userIDs)); err != nil {
		u.logger.Error(ctx, "failed to get dots for users",
			"error", err,
		)
		return nil, err
	}
	return dots, nil
}
