package postgres

import (
	"context"
	"sort"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/models"
)

var (
	ReactionTypeLike = "like"
)

type CommentRepo struct {
	db     *Database
	logger port.Logger
}

func NewCommentRepo(db *Database, logger port.Logger) port.CommentRepo {
	return &CommentRepo{db: db, logger: logger}
}

func (c *CommentRepo) AddReactionToComment(ctx context.Context, commentID string, userID string) error {
	c.logger.Info(ctx, "adding reaction to comment",
		"comment_id", commentID,
		"user_id", userID,
	)

	query := `--sql
		INSERT INTO comments_reactions (comment_id, user_id, type)
		VALUES ($1, $2, $3)
		ON CONFLICT DO NOTHING;
	`
	if _, err := c.db.ExecContext(ctx, query, commentID, userID, ReactionTypeLike); err != nil {
		c.logger.Error(ctx, "failed to add reaction to comment",
			"error", err,
			"comment_id", commentID,
			"user_id", userID,
		)
		return err
	}

	return nil
}

func (c *CommentRepo) CreateComment(ctx context.Context, content string, postID string, userID string, parentCommentID *string) error {
	c.logger.Info(ctx, "creating comment",
		"post_id", postID,
		"user_id", userID,
		"parent_comment_id", parentCommentID,
	)

	query := `--sql
		INSERT INTO comment (id, content, post_id, user_id, parent_comment_id, created_at, updated_at)
		VALUES (gen_random_uuid(), $1, $2, $3, $4, NOW(), NOW());
	`
	if _, err := c.db.ExecContext(ctx, query, content, postID, userID, parentCommentID); err != nil {
		c.logger.Error(ctx, "failed to create comment",
			"error", err,
			"post_id", postID,
			"user_id", userID,
			"parent_comment_id", parentCommentID,
		)
		return err
	}

	return nil
}

func (c *CommentRepo) GetCommentsByID(ctx context.Context, id string) ([]model.CommentAggregate, error) {
	c.logger.Info(ctx, "getting comments by post id",
		"post_id", id,
	)

	query := `--sql
		SELECT c.id, c.content, c.post_id, c.user_id, c.parent_comment_id, c.created_at, c.updated_at,
		       u.id, u.name, u.image,
		       cr.comment_id, cr.user_id, cr.type, cr.created_at
		FROM comment c
		LEFT JOIN "user" u ON c.user_id = u.id
		LEFT JOIN comments_reactions cr ON c.id = cr.comment_id
		WHERE c.post_id = $1
		ORDER BY c.created_at DESC;
	`

	rows, err := c.db.QueryContext(ctx, query, id)
	if err != nil {
		c.logger.Error(ctx, "failed to get comments by post id",
			"error", err,
			"post_id", id,
		)

		return nil, err
	}
	defer func() { _ = rows.Close() }()

	commentMap := map[string]*model.CommentAggregate{}

	for rows.Next() {
		var (
			commentDB         models.CommentDB
			uID               *string
			uName             *string
			uImage            *string
			reactionCommentID *string
			reactionUserID    *string
			reactionType      *string
			reactionCreatedAt *time.Time
		)

		err := rows.Scan(&commentDB.ID, &commentDB.Content, &commentDB.PostID, &commentDB.UserID, &commentDB.ParentCommentID, &commentDB.CreatedAt, &commentDB.UpdatedAt,
			&uID, &uName, &uImage,
			&reactionCommentID, &reactionUserID, &reactionType, &reactionCreatedAt)
		if err != nil {
			return nil, err
		}

		comment, exists := commentMap[commentDB.ID]
		if !exists {
			comment = &model.CommentAggregate{
				Comment:   *commentDB.ToDomain(),
				Reactions: []model.CommentsReaction{},
			}
			if uID != nil {
				comment.User = &model.UserSummary{
					ID:    *uID,
					Name:  uName,
					Image: uImage,
				}
			}
			commentMap[commentDB.ID] = comment
		}

		if reactionCommentID != nil && reactionUserID != nil && reactionType != nil && reactionCreatedAt != nil {
			reactionDB := &models.CommentsReactionDB{
				CommentID: *reactionCommentID,
				UserID:    *reactionUserID,
				Type:      *reactionType,
				CreatedAt: *reactionCreatedAt,
			}
			comment.Reactions = append(comment.Reactions, *reactionDB.ToDomain())
		}
	}

	comments := make([]model.CommentAggregate, 0, len(commentMap))
	for _, comment := range commentMap {
		// Sort reactions by created_at ASC (oldest first) for consistent ordering
		sort.Slice(comment.Reactions, func(i, j int) bool {
			return comment.Reactions[i].CreatedAt.Before(comment.Reactions[j].CreatedAt)
		})
		comments = append(comments, *comment)
	}

	// Sort comments by created_at DESC (newest first) to ensure consistent ordering
	sort.Slice(comments, func(i, j int) bool {
		return comments[i].CreatedAt.After(comments[j].CreatedAt)
	})

	return comments, nil
}

func (c *CommentRepo) IsReactedByUser(ctx context.Context, commentID string, userID string) (bool, error) {
	c.logger.Info(ctx, "checking if user reacted to comment",
		"comment_id", commentID,
		"user_id", userID,
	)

	query := `--sql
		SELECT COUNT(1)
		FROM comments_reactions
		WHERE comment_id = $1 AND user_id = $2;
	`
	var count int
	err := c.db.QueryRowContext(ctx, query, commentID, userID).Scan(&count)
	if err != nil {
		c.logger.Error(ctx, "failed to check if user reacted to comment",
			"error", err,
			"comment_id", commentID,
			"user_id", userID,
		)
		return false, err
	}
	return count > 0, nil
}

func (c *CommentRepo) DeleteReactionFromComment(ctx context.Context, commentID string, userID string) error {
	c.logger.Info(ctx, "deleting reaction from comment",
		"comment_id", commentID,
		"user_id", userID,
	)

	query := `--sql
		DELETE FROM comments_reactions
		WHERE comment_id = $1 AND user_id = $2;
	`
	if _, err := c.db.ExecContext(ctx, query, commentID, userID); err != nil {
		c.logger.Error(ctx, "failed to delete reaction from comment",
			"error", err,
			"comment_id", commentID,
			"user_id", userID,
		)
		return err
	}

	return nil
}
