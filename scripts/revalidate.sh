ACTION=$1
PATH_OR_TAG=$2

if [ -z "$ACTION" ]; then
  echo "Usage: $0 <tag | path> <path_or_tag>"
  exit 1
fi

if [ -z "$PATH_OR_TAG" ]; then
  echo "Usage: $0 <tag | path> <path_or_tag>"
  exit 1
fi

if [ "$ACTION" != "tag" ] && [ "$ACTION" != "path" ]; then
  echo "Usage: $0 <tag | path> <path_or_tag>"
  exit 1
fi

curl -X POST \
  -H "Content-Type: application/json" \
  -d "{\"$ACTION\": \"$PATH_OR_TAG\"}" \
  http://localhost:3000/api/revalidate
