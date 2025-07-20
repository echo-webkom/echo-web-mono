package ban

import (
	"context"
	"time"

	"github.com/echo-webkom/uno/storage/database"
	"github.com/jackc/pgx/v5/pgxpool"
)

type BanService struct {
	pool *pgxpool.Pool
}

func New(pool *pgxpool.Pool) *BanService {
	return &BanService{
		pool: pool,
	}
}

// Get the ban information for a user.
func (s *BanService) FindByUserID(ctx context.Context, userID string) (database.BanInfo, error) {
	var banInfo database.BanInfo

	query := `--sql
		SELECT id, user_id, banned_by, reason, created_at, expires_at
		FROM ban_info
		WHERE user_id = $1
	`

	err := s.pool.QueryRow(ctx, query, userID).Scan(
		&banInfo.ID,
		&banInfo.UserID,
		&banInfo.BannedBy,
		&banInfo.Reason,
		&banInfo.CreatedAt,
		&banInfo.ExpiresAt,
	)
	if err != nil {
		return database.BanInfo{}, err
	}

	return banInfo, nil
}

// Deletes a ban by ID.
func (s *BanService) Delete(ctx context.Context, id int) error {
	query := `--sql
		DELETE FROM ban_info
		WHERE id = $1
	`
	_, err := s.pool.Exec(ctx, query, id)
	if err != nil {
		return err
	}
	return nil
}

// Check if a user is banned.
// Deletes the ban if it exists, but is expired.
func (s *BanService) IsBanned(ctx context.Context, userID string) bool {
	info, err := s.FindByUserID(ctx, userID)
	if err != nil {
		return false
	}

	if info.ExpiresAt.After(time.Now()) {
		return true
	}

	s.Delete(ctx, info.ID)

	return false
}
