package repo

import (
	"context"
	"uno/domain/model"
)

type RegistrationRepo interface {
	GetRegistrationsByHappeningId(ctx context.Context, hapId string) ([]model.Registration, error)
}
