package feedback

type NewFeedbackRequest struct {
	Email   *string `json:"email,omitempty"`
	Name    *string `json:"name,omitempty"`
	Message string  `json:"message"`
}
