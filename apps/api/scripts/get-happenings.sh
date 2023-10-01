#!/usr/bin/env bash

source .env

curl -X GET -H "Content-Type: application/json" http://localhost:$PORT/happenings
