# Vertex frontend documentation

## Building with Docker

```sh
docker build \
    --build-arg PUBLIC_VERTEX_FEIDE_REDIRECT_URI=$PUBLIC_VERTEX_FEIDE_REDIRECT_URI \
    --build-arg PUBLIC_SANITY_DATASET=$PUBLIC_SANITY_DATASET \
    --build-arg PUBLIC_SANITY_PROJECT_ID=$PUBLIC_SANITY_PROJECT_ID \
    --build-arg PUBLIC_AXIS_URL=$PUBLIC_AXIS_URL \
    --build-arg PUBLIC_ECHOGRAM_URL=$PUBLIC_ECHOGRAM_URL \
    --secret id=database_url,env=DATABASE_URL \
    --secret id=admin_key,env=ADMIN_KEY \
    -t echo-webkom/vertex:latest \
    -f apps/vertex/Dockerfile .
```
