package jobs

import (
	"context"
	"fmt"
	"uno/domain/port"
	"uno/domain/service"
	"uno/infrastructure/postgres"
)

type CleanupSensitiveQuestionsJob struct {
	questionService *service.QuestionService
	logger          port.Logger
}

func NewCleanupSensitiveQuestions(questionService *service.QuestionService, logger port.Logger) *CleanupSensitiveQuestionsJob {
	return &CleanupSensitiveQuestionsJob{
		questionService: questionService,
		logger:          logger,
	}
}

func (j *CleanupSensitiveQuestionsJob) Run(ctx context.Context) error {
	rowsAffected, err := j.questionService.CleanupSensitiveQuestions(ctx)
	if err != nil {
		return err
	}
	j.logger.Info(ctx, fmt.Sprintf("Deleted %d sensitive questions", rowsAffected))
	return nil
}

type CleanupOldStrikesJob struct {
	strikeService *service.StrikeService
	logger        port.Logger
}

func NewCleanupOldStrikes(strikeService *service.StrikeService, logger port.Logger) *CleanupOldStrikesJob {
	return &CleanupOldStrikesJob{
		strikeService: strikeService,
		logger:        logger,
	}
}

func (j *CleanupOldStrikesJob) Run(ctx context.Context) error {
	rowsAffected, err := j.strikeService.CleanupOldStrikes(ctx)
	if err != nil {
		return err
	}
	j.logger.Info(ctx, fmt.Sprintf("Deleted %d old strikes", rowsAffected))
	return nil
}

type ResetUserYearsJob struct {
	userService *service.UserService
	logger      port.Logger
}

func NewResetUserYears(userService *service.UserService, logger port.Logger) *ResetUserYearsJob {
	return &ResetUserYearsJob{
		userService: userService,
		logger:      logger,
	}
}

func (j *ResetUserYearsJob) Run(ctx context.Context) error {
	rowsAffected, err := j.userService.ResetUserYears(ctx)
	if err != nil {
		return err
	}
	j.logger.Info(ctx, fmt.Sprintf("Reset %d users' years", rowsAffected))
	return nil
}

type KVCleanupJob struct {
	db     *postgres.Database
	logger port.Logger
}

func (j *KVCleanupJob) Run(ctx context.Context) error {
	query := `--sql
		DELETE FROM kv
		WHERE ttl < NOW()
	`

	result, err := j.db.ExecContext(ctx, query)
	if err != nil {
		return fmt.Errorf("job kv cleanup: execute query: %w", err)
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		return fmt.Errorf("job kv cleanup: get rows affected: %w", err)
	}

	j.logger.Info(ctx, fmt.Sprintf("Deleted %d expired key-value pairs", rowsAffected))
	return nil
}

func NewCleanupExpiredKV(db *postgres.Database, logger port.Logger) *KVCleanupJob {
	return &KVCleanupJob{
		db:     db,
		logger: logger,
	}
}

type ModerationCleanup struct {
	strikeService *service.StrikeService
}

func NewModerationCleanup(strikeService *service.StrikeService) *ModerationCleanup {
	return &ModerationCleanup{strikeService: strikeService}
}

func (m *ModerationCleanup) Run(ctx context.Context) error {
	return m.strikeService.UnbanUsersWithExpiredStrikes(ctx)
}
