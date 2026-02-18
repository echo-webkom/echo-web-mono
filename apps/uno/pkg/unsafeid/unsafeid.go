package unsafeid

import (
	"crypto/rand"
	"encoding/hex"
	"errors"
)

// Generate returns a random hex string of the given length.
// It is not guaranteed to be unique, but the probability of collision is very low.
func Generate(length int) (string, error) {
	if length <= 0 {
		return "", errors.New("length must be a positive integer")
	}
	b := make([]byte, (length+1)/2)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b)[:length], nil
}
