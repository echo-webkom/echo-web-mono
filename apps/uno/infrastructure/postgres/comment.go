package postgres

import (
	"context"
	"time"
	"uno/domain/model"
	"uno/domain/port"
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
	_, err := c.db.ExecContext(ctx, query, commentID, userID, ReactionTypeLike)
	if err != nil {
		c.logger.Error(ctx, "failed to add reaction to comment",
			"error", err,
			"comment_id", commentID,
			"user_id", userID,
		)
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
	_, err := c.db.ExecContext(ctx, query, content, postID, userID, parentCommentID)
	if err != nil {
		c.logger.Error(ctx, "failed to create comment",
			"error", err,
			"post_id", postID,
			"user_id", userID,
			"parent_comment_id", parentCommentID,
		)
	}
	return err
}

func (c *CommentRepo) GetCommentsByID(ctx context.Context, id string) ([]port.CommentWithReactionsAndUser, error) {
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

	commentMap := map[string]*port.CommentWithReactionsAndUser{}

	for rows.Next() {
		var (
			commentID         string
			content           string
			postID            string
			userID            string
			parentCommentID   *string
			createdAt         time.Time
			updatedAt         time.Time
			uID               *string
			uName             *string
			uImage            *string
			reactionCommentID *string
			reactionUserID    *string
			reactionType      *string
			reactionCreatedAt *time.Time
		)

		err := rows.Scan(&commentID, &content, &postID, &userID, &parentCommentID, &createdAt, &updatedAt,
			&uID, &uName, &uImage,
			&reactionCommentID, &reactionUserID, &reactionType, &reactionCreatedAt)
		if err != nil {
			return nil, err
		}

		comment, exists := commentMap[commentID]
		if !exists {
			comment = &port.CommentWithReactionsAndUser{
				Comment: model.Comment{
					ID:              commentID,
					Content:         content,
					PostID:          postID,
					UserID:          &userID,
					ParentCommentID: parentCommentID,
					CreatedAt:       createdAt,
					UpdatedAt:       updatedAt,
				},
				Reactions: []model.CommentsReaction{},
			}
			if uID != nil {
				comment.User = &port.User{
					ID:    *uID,
					Name:  uName,
					Image: uImage,
				}
			}
			commentMap[commentID] = comment
		}

		if reactionCommentID != nil && reactionUserID != nil && reactionType != nil && reactionCreatedAt != nil {
			reaction := model.CommentsReaction{
				CommentID: *reactionCommentID,
				UserID:    *reactionUserID,
				Type:      *reactionType,
				CreatedAt: *reactionCreatedAt,
			}
			comment.Reactions = append(comment.Reactions, reaction)
		}
	}

	comments := []port.CommentWithReactionsAndUser{}
	for _, comment := range commentMap {
		comments = append(comments, *comment)
	}

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
	_, err := c.db.ExecContext(ctx, query, commentID, userID)
	if err != nil {
		c.logger.Error(ctx, "failed to delete reaction from comment",
			"error", err,
			"comment_id", commentID,
			"user_id", userID,
		)
	}
	return nil
}
