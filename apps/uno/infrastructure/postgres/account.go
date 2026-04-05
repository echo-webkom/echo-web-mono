package postgres

import (
	"context"
	"database/sql"
	"uno/domain/model"
	"uno/domain/port"
	"uno/infrastructure/postgres/record"
)

type AccountRepo struct {
	db     *Database
	logger port.Logger
}

func NewAccountRepo(db *Database, logger port.Logger) port.AccountRepo {
	return &AccountRepo{db: db, logger: logger}
}

func (r *AccountRepo) GetAccountByProvider(ctx context.Context, provider, providerAccountID string) (model.Account, error) {
	r.logger.Info(ctx, "getting account by provider",
		"provider", provider,
		"provider_account_id", providerAccountID,
	)

	query := `--sql
		SELECT user_id, type, provider, provider_account_id, refresh_token, access_token,
		       expires_at, token_type, scope, id_token, session_state
		FROM "account"
		WHERE provider = $1 AND provider_account_id = $2
	`
	var accountDB record.AccountDB
	err := r.db.GetContext(ctx, &accountDB, query, provider, providerAccountID)
	if err == sql.ErrNoRows {
		r.logger.Info(ctx, "no account found for provider",
			"provider", provider,
			"provider_account_id", providerAccountID,
		)
		return model.Account{}, nil
	}
	if err != nil {
		r.logger.Error(ctx, "failed to get account by provider",
			"error", err,
			"provider", provider,
		)
		return model.Account{}, err
	}
	return *accountDB.ToDomain(), nil
}

func (r *AccountRepo) GetAccountsByUserID(ctx context.Context, userID string) ([]model.Account, error) {
	r.logger.Info(ctx, "getting accounts by user ID",
		"user_id", userID,
	)

	query := `--sql
		SELECT user_id, type, provider, provider_account_id, refresh_token, access_token,
		       expires_at, token_type, scope, id_token, session_state
		FROM "account"
		WHERE user_id = $1
	`
	var accountsDB []record.AccountDB
	err := r.db.SelectContext(ctx, &accountsDB, query, userID)
	if err != nil {
		r.logger.Error(ctx, "failed to get accounts by user ID",
			"error", err,
			"user_id", userID,
		)
		return []model.Account{}, err
	}

	accounts := make([]model.Account, len(accountsDB))
	for i, acc := range accountsDB {
		accounts[i] = *acc.ToDomain()
	}
	return accounts, nil
}

func (r *AccountRepo) CreateAccount(ctx context.Context, account model.NewAccount) (model.Account, error) {
	r.logger.Info(ctx, "creating account",
		"user_id", account.UserID,
		"provider", account.Provider,
	)

	query := `--sql
		INSERT INTO "account" (user_id, type, provider, provider_account_id, refresh_token,
		                      access_token, expires_at, token_type, scope, id_token, session_state)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
		RETURNING user_id, type, provider, provider_account_id, refresh_token, access_token,
		          expires_at, token_type, scope, id_token, session_state
	`
	var accountDB record.AccountDB
	err := r.db.GetContext(ctx, &accountDB, query,
		account.UserID,
		account.Type,
		account.Provider,
		account.ProviderAccountID,
		account.RefreshToken,
		account.AccessToken,
		account.ExpiresAt,
		account.TokenType,
		account.Scope,
		account.IDToken,
		account.SessionState,
	)
	if err != nil {
		r.logger.Error(ctx, "failed to create account",
			"error", err,
			"user_id", account.UserID,
		)
		return model.Account{}, err
	}
	return *accountDB.ToDomain(), nil
}

func (r *AccountRepo) DeleteAccount(ctx context.Context, userID, provider string) error {
	r.logger.Info(ctx, "deleting account",
		"user_id", userID,
		"provider", provider,
	)

	query := `--sql
		DELETE FROM "account"
		WHERE user_id = $1 AND provider = $2
	`
	_, err := r.db.ExecContext(ctx, query, userID, provider)
	if err != nil {
		r.logger.Error(ctx, "failed to delete account",
			"error", err,
			"user_id", userID,
			"provider", provider,
		)
		return err
	}
	return nil
}
