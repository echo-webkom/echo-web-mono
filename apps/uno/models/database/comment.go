package database

type Comment struct {
	ID              string  `json:"id"`
	PostID          string  `json:"post_id"`
	ParentCommentID *string `json:"parent_comment_id"`
	UserID          *string `json:"user_id"`
	Content         string  `json:"content"`
	CreatedAt       string  `json:"created_at"`
	UpdatedAt       string  `json:"updated_at"`
}

func (c Comment) TableName() string {
	return "comment"
}
