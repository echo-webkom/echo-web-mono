package record

import (
	"uno/domain/model"
)

type Quote struct {
	ID          string  `db:"id"`
	Text        string  `db:"text"`
	Context     *string `db:"context"`
	Person      string  `db:"person"`
	SubmittedAt string  `db:"submitted_at"`
}

func (r Quote) ToModel() model.Quote {
	return model.Quote{
		ID:          r.ID,
		Text:        r.Text,
		Context:     r.Context,
		Person:      r.Person,
		SubmittedAt: r.SubmittedAt,
	}
}

type QuoteInsert struct {
	Text        string  `db:"text"`
	Context     *string `db:"context"`
	Person      string  `db:"person"`
	SubmittedBy string  `db:"submitted_by"`
}

func (r QuoteInsert) FromModel(quote model.Quote, submittedBy string) QuoteInsert {
	return QuoteInsert{
		Text:        quote.Text,
		Context:     quote.Context,
		Person:      quote.Person,
		SubmittedBy: submittedBy,
	}
}
