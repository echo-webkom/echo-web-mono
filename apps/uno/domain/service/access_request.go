package service

import (
	"context"
	"fmt"
	"time"
	"uno/domain/model"
	"uno/domain/port"
)

type AccessRequestService struct {
	accessRequestRepo port.AccessRequestRepo
	whitelistRepo     port.WhitelistRepo
	emailClient       port.EmailClient
}

func NewAccessRequestService(
	accessRequestRepo port.AccessRequestRepo,
	whitelistRepo port.WhitelistRepo,
	emailClient port.EmailClient,
) *AccessRequestService {
	return &AccessRequestService{
		accessRequestRepo: accessRequestRepo,
		whitelistRepo:     whitelistRepo,
		emailClient:       emailClient,
	}
}

func (ars *AccessRequestService) GetAccessRequests(ctx context.Context) ([]model.AccessRequest, error) {
	return ars.accessRequestRepo.GetAccessRequests(ctx)
}

func (ars *AccessRequestService) CreateAccessRequest(ctx context.Context, ar model.NewAccessRequest) (model.AccessRequest, error) {
	created, err := ars.accessRequestRepo.CreateAccessRequest(ctx, ar)
	if err != nil {
		return model.AccessRequest{}, err
	}

	if ars.emailClient != nil {
		_ = ars.emailClient.SendAccessRequestNotification(
			ctx,
			[]string{"echo@uib.no"},
			"Forespørsel om tilgang til echo.uib.no",
			ar.Email,
			ar.Reason,
		)
	}

	return created, nil
}

func (ars *AccessRequestService) GetAccessRequestByID(ctx context.Context, id string) (model.AccessRequest, error) {
	return ars.accessRequestRepo.GetAccessRequestByID(ctx, id)
}

func (ars *AccessRequestService) DeleteAccessRequestByID(ctx context.Context, id string) error {
	return ars.accessRequestRepo.DeleteAccessRequestByID(ctx, id)
}

func (ars *AccessRequestService) ApproveAccessRequest(ctx context.Context, id string) error {
	ar, err := ars.accessRequestRepo.GetAccessRequestByID(ctx, id)
	if err != nil {
		return err
	}

	_, err = ars.whitelistRepo.UpsertWhitelist(ctx, model.NewWhitelist{
		Email:     ar.Email,
		ExpiresAt: accessRequestNextSemesterStart(),
		Reason:    fmt.Sprintf("Tilgang etter forespørsel: %s", ar.Reason),
	})
	if err != nil {
		return err
	}

	if err = ars.accessRequestRepo.DeleteAccessRequestByID(ctx, id); err != nil {
		return err
	}

	if ars.emailClient != nil {
		_ = ars.emailClient.SendAccessGranted(
			ctx,
			[]string{ar.Email},
			"Tilgang til echo.uib.no",
		)
	}

	return nil
}

func (ars *AccessRequestService) DenyAccessRequest(ctx context.Context, id, reason string) error {
	ar, err := ars.accessRequestRepo.GetAccessRequestByID(ctx, id)
	if err != nil {
		return err
	}

	if err = ars.accessRequestRepo.DeleteAccessRequestByID(ctx, id); err != nil {
		return err
	}

	if ars.emailClient != nil {
		_ = ars.emailClient.SendAccessDenied(
			ctx,
			[]string{ar.Email},
			"Tilgang til echo.uib.no avslått",
			reason,
		)
	}

	return nil
}

func accessRequestNextSemesterStart() time.Time {
	now := time.Now()
	if now.Month() >= time.August {
		return time.Date(now.Year()+1, time.January, 1, 0, 0, 0, 0, time.Local)
	}
	return time.Date(now.Year(), time.August, 1, 0, 0, 0, 0, time.Local)
}
