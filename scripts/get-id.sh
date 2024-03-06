#!/usr/bin/env bash

EMAIL=$1

source .env

if [ -z "$EMAIL" ]; then
  echo "Usage: $0 <email>"
  exit 1
fi

QUERY="SELECT id, email FROM \"user\" WHERE email = '$EMAIL';"

psql $DATABASE_URL -c "$QUERY"
