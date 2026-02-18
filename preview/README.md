# VPS

Copy the contents of `caddy-compose.yaml` to your VPS and run `docker compose -f caddy-compose.yaml up -d` to start the Caddy reverse proxy. Make sure to set the environment variables as needed, especially `PREVIEW_DOMAIN` which should be the domain you want to use for accessing the preview instances. This can be placed in a `.env` file or set directly in the command line before running the Docker Compose command.

Also create a `dozzle/users.yaml` with the users you want to have access to Dozzle. You can generate a password with:

```bash
docker run -it --rm amir20/dozzle generate --name <name> --email <email> --password <password> <username>
```

Paste the output into the `users.yaml`.

