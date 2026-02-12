# Ansible — Tutorial 2: Install Package, Docker, dan Nginx

Tutorial ini untuk **langkah kedua**: menjalankan playbook setup di `ansible/examples` — install paket dasar, Docker, dan Nginx.

**Prasyarat:** Tutorial 1 (hardening) sudah dijalankan. Server sudah punya user `deploy` dan root login non-aktif. Lihat [Tutorial 1: Hardening](001-ansible-tutorial-hardening.md).

---

## Persiapan

- **Inventory** pakai `ansible_user=deploy` (bukan root):

```ini
[web]
152.42.218.38 ansible_user=deploy
```

Kalau masih `ansible_user=root`, ganti dulu. Setelah Tutorial 1, login root sudah tidak bisa.

---

## Tujuan Tutorial 2

Playbook akan:
- **common:** update apt, install paket dasar (curl, git, ufw)
- **docker:** install Docker, tambah user `deploy` ke group docker, jalankan dan enable service docker
- **nginx:** install Nginx, jalankan dan enable service nginx

---

## Cara menjalankan

```bash
cd ansible/examples
ansible-playbook -i inventory.ini site.yml
```

Yang dijalankan: playbook `site.yml` menarget group `web`, roles **common** → **docker** → **nginx**.

---

## Urutan lengkap (Tutorial 1 + 2)

| Langkah | Perintah | Inventory |
|--------|----------|-----------|
| 1 | `ansible-playbook -i inventory.ini playbook.yml` | `ansible_user=root` |
| 2 | Ubah `inventory.ini` → `ansible_user=deploy` | — |
| 3 | `ansible-playbook -i inventory.ini site.yml` | `ansible_user=deploy` |

---

## Troubleshooting

- **Permission denied (publickey)**  
  Pastikan SSH key dipakai: `ssh -i ~/.ssh/id_rsa deploy@<IP>`. Inventory pakai `ansible_user=deploy`.

- **Root login disabled, belum ganti inventory**  
  Ganti `inventory.ini` ke `ansible_user=deploy` lalu jalankan lagi.

- **Host/group tidak ketemu**  
  Pastikan di `inventory.ini` ada section `[web]` dan IP-nya benar.
