package service

import (
	"uno/domain/port"
)

type QuoteService struct {
	quoteRepo port.QuoteRepo
}

func NewQuoteService(quoteRepo port.QuoteRepo) *QuoteService {
	return &QuoteService{
		quoteRepo: quoteRepo,
	}
}

func (s *QuoteService) Repo() port.QuoteRepo {
	return s.quoteRepo
}
