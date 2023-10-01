#!/usr/bin/env bash

source .env

SLUG=$1

if [[ -z $SLUG ]]; then
  echo "Usage: $0 <slug>"
  exit 1
fi

curl -X GET -H "Content-Type: application/json" http://localhost:$PORT/happening/$SLUG
