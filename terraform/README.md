# Terraform

Cheatsheet dan contoh konfigurasi Terraform.

---

## Bagian-bagian

### `docs/terraform/`

Dokumentasi — penjelasan konsep dan perintah.

| File | Isi |
|------|-----|
| [001-explain.md](docs/terraform/001-explain.md) | Struktur file (provider, variable, data, resource, output) — apa fungsinya |
| [001-command.md](docs/terraform/001-command.md) | Perintah-perintah dasar + kasus khusus |

---

### `examples/`

Contoh konfigurasi — DigitalOcean droplet dan firewall.

| File | Isi |
|------|-----|
| `provider.tf` | Koneksi ke DigitalOcean |
| `variable.tf` | Input (token, dll) |
| `data.tf` | Query data eksisting (SSH key) |
| `main.tf` | Resource yang dibuat (droplet) |
| `firewall.tf` | Resource firewall untuk membatasi akses jaringan |
| `outputs.tf` | Output (IP, dll) |
| `.tfvars.example` | Template variable — copy ke `.tfvars` |
