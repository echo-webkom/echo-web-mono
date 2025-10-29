package session

type SessionRepo interface {
}

type Service struct {
	repo SessionRepo
}

func NewService(repo SessionRepo) *Service {
	return &Service{repo}
}
