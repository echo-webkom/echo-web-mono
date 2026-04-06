package postgres

import (
	"context"
	"database/sql"
	"time"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
)

type VerificationTokenRepo struct {
	db     *Database
	logger port.Logger
}

func NewVerificationTokenRepo(db *Database, logger port.Logger) port.VerificationTokenRepo {
	return &VerificationTokenRepo{db: db, logger: logger}
}

func (r *VerificationTokenRepo) GetVerificationToken(ctx context.Context, identifier, token string) (model.VerificationToken, error) {
	r.logger.Info(ctx, "getting verification token",
		"identifier", identifier,
	)

	query := `--sql
		SELECT identifier, token, expires
		FROM verification_token
		WHERE identifier = $1 AND token = $2
	`
	var tokenDB record.VerificationTokenDB
	err := r.db.GetContext(ctx, &tokenDB, query, identifier, token)
	if err == sql.ErrNoRows {
		r.logger.Info(ctx, "no verification token found",
			"identifier", identifier,
		)
		return model.VerificationToken{}, nil
	}
	if err != nil {
		r.logger.Error(ctx, "failed to get verification token",
			"error", err,
			"identifier", identifier,
		)
		return model.VerificationToken{}, err
	}
	return *tokenDB.ToDomain(), nil
}

func (r *VerificationTokenRepo) CreateVerificationToken(ctx context.Context, token model.VerificationToken) (model.VerificationToken, error) {
	r.logger.Info(ctx, "creating verification token",
		"identifier", token.Identifier,
	)

	query := `--sql
		INSERT INTO verification_token (identifier, token, expires)
		VALUES ($1, $2, $3)
		RETURNING identifier, token, expires
	`
	var tokenDB record.VerificationTokenDB
	err := r.db.GetContext(ctx, &tokenDB, query, token.Identifier, token.Token, token.ExpiresAt)
	if err != nil {
		r.logger.Error(ctx, "failed to create verification token",
			"error", err,
			"identifier", token.Identifier,
		)
		return model.VerificationToken{}, err
	}
	return *tokenDB.ToDomain(), nil
}

func (r *VerificationTokenRepo) DeleteVerificationToken(ctx context.Context, identifier, token string) error {
	r.logger.Info(ctx, "deleting verification token",
		"identifier", identifier,
	)

	query := `--sql
		DELETE FROM verification_token
		WHERE identifier = $1 AND token = $2
	`
	_, err := r.db.ExecContext(ctx, query, identifier, token)
	if err != nil {
		r.logger.Error(ctx, "failed to delete verification token",
			"error", err,
			"identifier", identifier,
		)
		return err
	}
	return nil
}

func (r *VerificationTokenRepo) MarkTokenAsUsed(ctx context.Context, identifier, token string) error {
	r.logger.Info(ctx, "marking verification token as used",
		"identifier", identifier,
	)

	query := `--sql
		UPDATE verification_token
		SET expires = NOW() - INTERVAL '1 second', used = true
		WHERE identifier = $1 AND token = $2
	`
	_, err := r.db.ExecContext(ctx, query, identifier, token)
	if err != nil {
		r.logger.Error(ctx, "failed to mark verification token as used",
			"error", err,
			"identifier", identifier,
		)
		return err
	}
	return nil
}

func (r *VerificationTokenRepo) GetAndMarkTokenAsUsed(ctx context.Context, identifier, token string) (model.VerificationToken, error) {
	r.logger.Info(ctx, "atomically getting and marking verification token as used",
		"identifier", identifier,
	)

	tx, err := r.db.BeginTxx(ctx, nil)
	if err != nil {
		r.logger.Error(ctx, "failed to begin transaction",
			"error", err,
			"identifier", identifier,
		)
		return model.VerificationToken{}, err
	}
	defer func() { _ = tx.Rollback() }()

	query := `--sql
		SELECT identifier, token, expires
		FROM verification_token
		WHERE identifier = $1 AND token = $2
		FOR UPDATE
	`
	var tokenDB record.VerificationTokenDB
	err = tx.GetContext(ctx, &tokenDB, query, identifier, token)
	if err == sql.ErrNoRows {
		r.logger.Info(ctx, "no verification token found",
			"identifier", identifier,
		)
		return model.VerificationToken{}, nil
	}
	if err != nil {
		r.logger.Error(ctx, "failed to get verification token",
			"error", err,
			"identifier", identifier,
		)
		return model.VerificationToken{}, err
	}

	tokenModel := tokenDB.ToDomain()
	if tokenModel.IsExpired(time.Now()) {
		return *tokenModel, model.ErrVerificationTokenExpired
	}

	updateQuery := `--sql
		UPDATE verification_token
		SET expires = NOW() - INTERVAL '1 second', used = true
		WHERE identifier = $1 AND token = $2
	`
	if _, err := tx.ExecContext(ctx, updateQuery, identifier, token); err != nil {
		r.logger.Error(ctx, "failed to mark verification token as used",
			"error", err,
			"identifier", identifier,
		)
		return model.VerificationToken{}, err
	}

	if err := tx.Commit(); err != nil {
		r.logger.Error(ctx, "failed to commit transaction",
			"error", err,
			"identifier", identifier,
		)
		return model.VerificationToken{}, err
	}

	return *tokenModel, nil
}
