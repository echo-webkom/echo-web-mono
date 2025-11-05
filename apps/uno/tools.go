//go:build tools
// +build tools

// This file declares dependencies on build and development tools.
// It ensures these tools are tracked in go.mod for version consistency.

package tools

import (
	_ "github.com/air-verse/air"
	_ "github.com/swaggo/swag/cmd/swag"
	_ "github.com/vektra/mockery/v3"
)
