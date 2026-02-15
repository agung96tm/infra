# Ansible

Cheatsheet dan contoh konfigurasi Ansible.

---

## Bagian-bagian

### `docs/`

Dokumentasi — tutorial dipisah per langkah.

| File | Isi |
|------|-----|
| [001-ansible-tutorial-hardening.md](docs/001-ansible-tutorial-hardening.md) | **Tutorial 1** — Non-aktifkan root, buat user deploy, set SSH key (pakai `playbook.yml`) |
| [002-ansible-tutorial-setup.md](docs/002-ansible-tutorial-setup.md) | **Tutorial 2** — Install package (common), Docker, Nginx (pakai `site.yml`) |

---

### `examples/`

Contoh playbook dan role — hardening server lalu setup common, Docker, Nginx, app.

| File / folder | Isi |
|---------------|-----|
| `inventory.ini` | Daftar host (group `web`) — sesuaikan IP dan `ansible_user` (root untuk step 1, deploy untuk step 2) |
| `playbook.yml` | Step 1: target `web`, role hardening |
| `site.yml` | Step 2: target `web`, roles common, docker, nginx, app |
| `group_vars/web/secrets.yml` | Variabel rahasia (jwt_secret, database_url) — dienkripsi vault |
| `roles/hardening/` | Buat user deploy, SSH key, non-aktifkan root & password auth |
| `roles/common/` | Update apt, install curl, git, ufw |
| `roles/docker/` | Install Docker, user deploy ke group docker, enable service |
| `roles/nginx/` | Install Nginx, enable service |
| `roles/app/` | Pull image Docker, jalankan container API & React |

---

## Vault & Menjalankan site.yml

Role `app` membutuhkan `jwt_secret` dan `database_url` dari `group_vars/web/secrets.yml`. File ini dienkripsi dengan Ansible Vault agar secret tidak terbaca di repo.

### 1. Buat file .vault_pass

Buat file berisi password vault (satu baris). **Jangan commit** — sudah di `.gitignore`.

```bash
cd examples
echo "password-vault-kamu" > .vault_pass
chmod 600 .vault_pass
```

### 2. Buat & enkripsi secrets.yml

**Opsi A — file belum ada:**

```bash
cd examples
mkdir -p group_vars/web

# Buat file plain dulu
cat > group_vars/web/secrets.yml << 'EOF'
jwt_secret: your-secret-key
database_url: postgresql://user:pass@localhost:5432/db
EOF

# Enkripsi
ansible-vault encrypt group_vars/web/secrets.yml --vault-password-file .vault_pass
```

**Opsi B — edit file yang sudah terenkripsi:**

```bash
ansible-vault edit group_vars/web/secrets.yml --vault-password-file .vault_pass
```

### 3. Jalankan playbook

```bash
cd examples
ansible-playbook -i inventory.ini site.yml --vault-password-file .vault_pass
```

---

## Role app — apa yang dijalankan?

`roles/app/tasks/main.yml` menjalankan:

1. **Pull image** — `agung96tm/node-api-app` dan `agung96tm/node-react-app` dari Docker Hub
2. **Run backend container** — image `node-api-app`, port 3000, env:
   - `PORT`, `NODE_ENV`, `APP_NAME`
   - `JWT_SECRET`, `DATABASE_URL` ← dari `secrets.yml` (vault)
3. **Run frontend container** — image `node-react-app`, port 80

Image tersebut berasal dari `apps/node-api-app` dan `apps/node-react-app` — build & push ke Docker Hub sesuai README di folder masing-masing.
