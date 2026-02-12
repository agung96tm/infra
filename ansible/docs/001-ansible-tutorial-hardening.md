# Ansible — Tutorial 1: Hardening (Non-aktifkan Root & Buat User Deploy)

Tutorial ini hanya untuk **langkah pertama**: menjalankan playbook hardening di `ansible/examples` — non-aktifkan login root, buat user `deploy`, set SSH key.

---

## Prasyarat

**Pelajari Terraform dulu** sebelum pakai Ansible. Server yang dipakai Ansible biasanya dibuat lewat Terraform (misalnya Droplet di DigitalOcean). Disarankan baca dan jalankan contoh di **`terraform/examples`** dulu. Setelah server ada dan punya IP, baru pakai Ansible.

Atau minimal punya satu server (IP + akses SSH root) untuk mencoba.

---

## Persiapan

- **Ansible** terpasang di mesin lokal.
- **SSH key**: pastikan `~/.ssh/id_rsa` dan `~/.ssh/id_rsa.pub` ada (role hardening memakai public key ini untuk user `deploy`).
- **Inventory**: di `ansible/examples/inventory.ini` sesuaikan IP dan pakai `ansible_user=root`.

Contoh `inventory.ini`:

```ini
[web]
152.42.218.38 ansible_user=root
```

Ganti `152.42.218.38` dengan IP server. Wajib pakai `ansible_user=root` karena kita akan non-aktifkan root dan membuat user `deploy`.

---

## Tujuan Tutorial 1

Playbook akan:
- Membuat user `deploy` (dengan sudo)
- Menambah SSH key kamu ke `deploy` (dari `~/.ssh/id_rsa.pub`)
- Menonaktifkan login dengan password dan login sebagai root
- Merestart SSH

Setelah selesai, satu-satunya cara masuk ke server adalah sebagai user `deploy` dengan SSH key. Login root akan ditolak.

---

## Cara menjalankan

```bash
cd ansible/examples
ansible-playbook -i inventory.ini playbook.yml
```

Yang dijalankan: playbook `playbook.yml` menarget group `web`, role **hardening** (`roles/hardening/tasks/main.yml`).

---

## Setelah selesai

1. Cek login sebagai `deploy`:
   ```bash
   ssh deploy@<IP_SERVER>
   ```
2. Untuk **Tutorial 2** (install package, Docker, Nginx), update `inventory.ini`:
   ```ini
   [web]
   152.42.218.38 ansible_user=deploy
   ```
   Jangan pakai `ansible_user=root` lagi.

Lanjut ke [Tutorial 2: Install package, Docker, Nginx](002-ansible-tutorial-setup.md).
