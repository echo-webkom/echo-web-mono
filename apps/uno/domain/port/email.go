package port

import "context"

type EmailClient interface {
	SendRegistrationConfirmation(ctx context.Context, to []string, subject, title string, isBedpres bool) error
	SendDeregistrationNotification(ctx context.Context, to []string, subject, name, reason, happeningTitle string) error
	SendGotSpotNotification(ctx context.Context, to []string, subject, name, happeningTitle string) error
	SendStrikeNotification(ctx context.Context, to []string, subject, name, reason string, amount int, isBanned bool) error
	SendAccessGranted(ctx context.Context, to []string, subject string) error
	SendAccessDenied(ctx context.Context, to []string, subject, reason string) error
	SendAccessRequestNotification(ctx context.Context, to []string, subject, email, reason string) error
	SendEmailVerification(ctx context.Context, to []string, subject, verificationURL, firstName string) error
	SendMagicLink(ctx context.Context, to []string, subject, magicLinkURL, code, firstName string) error
}
