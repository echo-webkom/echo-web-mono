package model

type Quote struct {
	ID          string
	Text        string
	Context     *string
	Person      string
	SubmittedAt string
}
