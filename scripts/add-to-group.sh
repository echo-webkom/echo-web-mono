#!/usr/bin/env bash

USER_ID=$1
GROUP_ID=$2

source .env

if [ -z "$USER_ID" ] || [ -z "$GROUP_ID" ]; then
  echo "Usage: $0 <user-id> <group-id>"
  exit 1
fi

QUERY="INSERT INTO users_to_groups (user_id, group_id) VALUES ('$USER_ID', '$GROUP_ID');"

psql $DATABASE_URL -c "$QUERY"
