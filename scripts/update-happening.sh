HAPPENING_ID=$1

if [ -z "$HAPPENING_ID" ]; then
  echo "Usage: $0 <happening-id>"
  exit 1
fi

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"_id": "'"$HAPPENING_ID"'"}' \
  http://localhost:3000/api/sanity
