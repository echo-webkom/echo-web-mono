FROM postgres:15.7

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=echo-web

COPY ./packages/db/drizzle/migrations /docker-entrypoint-initdb.d

EXPOSE 5432
