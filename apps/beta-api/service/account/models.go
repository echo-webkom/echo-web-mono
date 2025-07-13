package account

type Account struct {
	UserID            string `json:"userID"`
	Provider          string `json:"provider"`
	ProviderAccountID string `json:"providerAccountID"`
}
