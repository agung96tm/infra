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

Contoh playbook dan role — hardening server lalu setup common, Docker, Nginx.

| File / folder | Isi |
|---------------|-----|
| `inventory.ini` | Daftar host (group `web`) — sesuaikan IP dan `ansible_user` (root untuk step 1, deploy untuk step 2) |
| `playbook.yml` | Step 1: target `web`, role hardening |
| `site.yml` | Step 2: target `web`, roles common, docker, nginx |
| `roles/hardening/` | Buat user deploy, SSH key, non-aktifkan root & password auth |
| `roles/common/` | Update apt, install curl, git, ufw |
| `roles/docker/` | Install Docker, user deploy ke group docker, enable service |
| `roles/nginx/` | Install Nginx, enable service |
