# node-react-app

## Build

```bash
docker build -t node-react-app .
```

**Dengan environment (build-time):**

```bash
docker build -t node-react-app \
  --build-arg VITE_APP_TITLE="My App" \
  --build-arg VITE_API_URL="https://api.example.com" \
  .
```

## Run

```bash
docker run -p 80:80 node-react-app
```

App berjalan di http://localhost:80

## Environment (Build-time)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_APP_TITLE` | React + TypeScript | Judul tampil di halaman |
| `VITE_API_URL` | - | URL API (untuk koneksi ke backend) |

**Catatan:** React app ini static — env dimasukkan saat build, bukan runtime.

## Push ke Docker Hub

Ganti `<docker_username>` dengan Docker Hub username kamu.

```bash
# 1. Tag image
docker tag node-react-app:latest <docker_username>/node-react-app:latest

# 2. Login
docker login

# 3. Push
docker push <docker_username>/node-react-app:latest
```
