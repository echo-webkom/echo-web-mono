package model

import (
	"encoding/json"
	"time"
)

type KV struct {
	Key   string           `db:"key"`
	Value *json.RawMessage `db:"value"`
	Ttl   *time.Time       `db:"ttl"`
}
