# Terraform — Penjelasan Dasar

Referensi singkat untuk memahami struktur file dan alur kerja Terraform.

---

## 1. provider.tf — Koneksi ke Cloud Provider

```hcl
terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "2.68.0"
    }
  }
}

provider "digitalocean" {
  token = var.do_token
}
```

| Bagian | Fungsi |
|--------|--------|
| **terraform {}** | Mendefinisikan plugin/provider yang dibutuhkan beserta versinya |
| **provider "digitalocean"** | Konfigurasi koneksi ke DigitalOcean (token diambil dari variable) |

**Analogi:** Mirip `package.json` + `package-lock.json` — mendefinisikan dependency dan versinya.

**Best practice:** Simpan token di variable, jangan hardcode di file.

---

## 2. variable.tf — Input dari Luar

```hcl
variable "do_token" {}
```

| Fungsi | Keterangan |
|--------|------------|
| Mendefinisikan input wajib | Terraform akan error jika belum diisi |
| Fleksibel | Nilai bisa diisi lewat env atau file terpisah |

**Analogi:** Seperti parameter function — `connect(token)` — harus diisi dari luar.

**Cara mengisi nilai:**

```bash
# Opsi 1: Environment variable (prefix TF_VAR_)
export TF_VAR_do_token="dop_v1_xxx"
```

```hcl
# Opsi 2: File .tfvars (jangan commit ke git)
do_token = "dop_v1_xxx"
```

---

## 3. data.tf — Mengambil Data yang Sudah Ada

```hcl
data "digitalocean_ssh_key" "default" {
  name = "Agung Axio"
}
```

| Fungsi | Keterangan |
|--------|------------|
| Query data eksisting | Mencari SSH key yang sudah ada di DigitalOcean |
| Referensi | Mengambil ID berdasarkan nama untuk dipakai di resource lain |

**Analogi:** Seperti query SQL — `SELECT id FROM ssh_keys WHERE name = 'Agung Axio'`.

---

## 4. main.tf — Membuat Resource (Bikin Barangnya)

```hcl
resource "digitalocean_droplet" "web" {
  name     = "web-prod"
  region   = "sgp1"
  size     = "s-1vcpu-512mb-10gb"
  image    = "ubuntu-22-04-x64"
  ssh_keys = [data.digitalocean_ssh_key.default.id]
}
```

| Field | Arti |
|-------|------|
| `resource` | Deklarasi resource yang akan dibuat |
| `digitalocean_droplet` | Tipe resource |
| `web` | Nama internal untuk referensi di file lain |
| `ssh_keys` | Menggunakan ID SSH key dari `data.tf` |

Spesifikasi droplet sama seperti yang dibuat lewat dashboard — hanya dideklarasikan sebagai kode.

---

## 5. output.tf — Menampilkan Hasil

```hcl
output "server_ip" {
  value = digitalocean_droplet.web.ipv4_address
}
```

| Fungsi | Keterangan |
|--------|------------|
| Menampilkan info | Output penting muncul di terminal setelah `apply` |
| Integrasi | Bisa dipakai oleh tool lain (Ansible, script CI/CD, dll) |

**Contoh tampilan di terminal:**

```
Outputs:

server_ip = "152.42.246.234"
```

---

## 6. .tfvars — Nilai Variable (Opsional)

```hcl
do_token = "dop_v1_xxx"
```

| Fungsi | Keterangan |
|--------|------------|
| Mengisi variable | Nilai untuk variable yang didefinisikan di `variable.tf` |
| Aman | File ini **jangan** di-commit ke GitHub (tambahkan ke `.gitignore`) |

**Analogi:** Mirip file `.env` untuk environment variables.

---

## Alur Kerja

```
1. variable.tf    →  Token/kredensial sebagai input
2. provider.tf    →  Terraform connect ke DigitalOcean
3. data.tf        →  Cari SSH key yang sudah ada
4. main.tf        →  Bikin droplet sesuai spesifikasi
5. output.tf      →  Cetak IP address ke terminal
6. .tfvars        →  Nilai variable (opsional, jangan di-commit)
7. firewall.tf    →  Aturan firewall menempel ke droplet
```

**Urutan eksekusi:** Terraform membaca semua file `.tf`, lalu meresolve dependency secara otomatis (variable → provider → data → resource → output).

---

## 7. firewall.tf — Aturan Lalu Lintas ke Droplet

Mengatur firewall DigitalOcean yang menempel ke droplet: siapa yang boleh akses (inbound) dan droplet boleh keluar ke mana (outbound). Referensi: `terraform/examples/firewall.tf`.

```hcl
resource "digitalocean_firewall" "web_fw" {
  name = "web-firewall"

  droplet_ids = [
    digitalocean_droplet.web.id
  ]

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}
```

| Bagian | Arti |
|--------|------|
| **droplet_ids** | Firewall dipasang ke droplet ini (referensi ke `digitalocean_droplet.web`) |
| **inbound_rule** | Siapa boleh masuk: TCP, port spesifik (22, 80, 443) → attack surface kecil; HTTP/HTTPS pakai TCP |
| **source_addresses** | `0.0.0.0/0` dan `::/0` = semua IP boleh (wajar untuk HTTP/HTTPS, **tidak** wajar untuk SSH) |
| **outbound_rule** | Droplet boleh keluar ke mana; range lebar (1-65535) agar bisa update paket, DNS, dll |

**Analogi:** Seperti daftar “siapa boleh masuk lewat pintu mana” (inbound) dan “server boleh keluar ke mana” (outbound).

### Perbaikan yang disarankan

**Batasi SSH hanya dari IP sendiri** — jangan biarkan port 22 dari seluruh internet.

Opsi 1 — IP statis (ganti dengan IP kamu):

```hcl
inbound_rule {
  protocol         = "tcp"
  port_range       = "22"
  source_addresses = ["103.xxx.xxx.xxx/32"]
}
```

Opsi 2 — IP publik otomatis (dari mesin yang jalankan Terraform):

```hcl
data "http" "my_public_ip" {
  url = "https://ifconfig.me"
}

inbound_rule {
  protocol         = "tcp"
  port_range       = "22"
  source_addresses = ["${chomp(data.http.my_public_ip.response_body)}/32"]
}
```

### Catatan penting

- Kalau nanti pakai DB: **jangan** buka port DB ke publik; buka untuk jaringan internal saja.
- **Kesalahan umum:**
  - ❌ Buka port 1–65535 inbound
  - ❌ Lupa pakai firewall sama sekali
  - ❌ SSH dari semua IP selamanya
  - ❌ Atur firewall manual di dashboard (tidak terdokumentasi di kode)