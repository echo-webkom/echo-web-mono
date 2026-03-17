package model

type QuoteReactionType string

const (
	QuoteReactionLike    QuoteReactionType = "like"
	QuoteReactionDislike QuoteReactionType = "dislike"
)

type QuoteReaction struct {
	UserID       string
	ReactionType QuoteReactionType
}

type Quote struct {
	ID          string
	Text        string
	Context     *string
	Person      string
	SubmittedAt string
	Reactions   []QuoteReaction
}
