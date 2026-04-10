#!/bin/bash

FAILED=0
RED='\033[1;31m'
NC='\033[0m'

check() {
    echo "Checking for $1..."
    if ! eval "$2" &>/dev/null; then
        echo -e "  ${RED}ERROR: $3${NC}"
        FAILED=1
    fi
}

check "Docker (running)"     "docker info"                                      "Docker is not running"
check "Go"                   "go version"                                       "Go is not installed"
check "cenv"                 "command -v cenv"                                  "cenv is not installed"
check "air"                  "command -v air"                                   "air is not installed (go install github.com/air-verse/air@latest)"
check "swag"                 "command -v swag"                                  "swag is not installed (go install github.com/swaggo/swag/cmd/swag@latest)"
check "mockery"              "command -v mockery"                               "mockery is not installed (go install github.com/vektra/mockery/v3@latest)"
check "golangci-lint"        "command -v golangci-lint"                         "golangci-lint is not installed"
check "cenv configuration"   "cenv check"                                       "cenv check failed (cenv fix)"

[ $FAILED -eq 0 ] && echo "All checks passed." || { echo "Some checks failed."; exit 1; }
