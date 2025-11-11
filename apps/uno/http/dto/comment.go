package dto

type CreateCommentRequest struct {
	Content         string  `json:"content"`
	PostID          string  `json:"postId"`
	UserID          string  `json:"userId"`
	ParentCommentID *string `json:"parentCommentId"`
}

type ReactToCommentRequest struct {
	CommentID string `json:"commentId"`
	UserID    string `json:"userId"`
}
