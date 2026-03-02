package filestorage

import (
	"fmt"
	"net/url"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

type FileStorage struct {
	*minio.Client
}

func New(endpointURL string, accessKeyID string, secretAccessKey string) (*FileStorage, error) {
	parsed, err := url.Parse(endpointURL)
	if err != nil {
		return nil, fmt.Errorf("invalid endpoint URL: %w", err)
	}

	host := parsed.Host
	if host == "" {
		// Already a bare host (no scheme), use as-is
		host = endpointURL
	}

	client, err := minio.New(host, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKeyID, secretAccessKey, ""),
		Secure: parsed.Scheme == "https",
	})
	if err != nil {
		return nil, err
	}

	return &FileStorage{client}, nil
}
