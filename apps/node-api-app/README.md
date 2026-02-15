# node-api-app

## Build

```bash
docker build -t node-api-app .
```

## Run

```bash
docker run -p 3000:3000 node-api-app
```

## Environment

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `NODE_ENV` | development | Environment (production, development) |
| `APP_NAME` | node-api-app | App name (shown in API response) |
| `JWT_SECRET` | - | Secret untuk JWT (ditampilkan di `/` untuk contoh) |
| `DATABASE_URL` | - | Connection string database (ditampilkan di `/` untuk contoh) |

**Contoh dengan env:**

```bash
docker run -p 3000:3000 \
  -e PORT=3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=your-secret \
  -e DATABASE_URL=postgresql://user:pass@localhost:5432/db \
  node-api-app
```

**Pakai file .env:**

```bash
docker run -p 3000:3000 --env-file .env node-api-app
```

## Push ke Docker Hub

Ganti `<docker_username>` dengan Docker Hub username kamu.

```bash
# 1. Tag image
docker tag node-api-app:latest <docker_username>/node-api-app:latest

# 2. Login
docker login

# 3. Push
docker push <docker_username>/node-api-app:latest
```
