# Tutorial Terraform — Part 2: Setup Project (DigitalOcean)

Part kedua: setup project Terraform dari nol, penjelasan per file, dan cara menjalankannya. **Provider yang dipakai: DigitalOcean.**

**Referensi contoh:** Untuk lihat file dan settingan lengkap, cek folder [projects/terraform](projects/terraform).

---

## Yang Dibutuhkan Sebelum Mulai

1. **Akun DigitalOcean** — [Daftar di sini](https://www.digitalocean.com/) kalau belum punya.
2. **Token API** — untuk autentikasi Terraform ke DigitalOcean (cara dapat di bawah).
3. **SSH key** — sudah di-upload ke DigitalOcean dan namanya dipakai di `data.tf` (cara dapat di bawah).

---

## Dapatkan Token DigitalOcean

Token dipakai agar Terraform bisa create/update/delete resource (droplet, firewall, dll) atas nama akun kamu.

1. Login ke [DigitalOcean](https://cloud.digitalocean.com/).
2. Klik **API** di menu samping (atau buka [DigitalOcean API Tokens](https://cloud.digitalocean.com/account/api/tokens)).
3. Klik **Generate New Token**.
4. Beri nama (misalnya `terraform-tutorial`), pilih **Read and Write**.
5. Klik **Generate Token**.
6. **Copy token** (format mirip `dop_v1_xxxxxxxxxxxx`) dan simpan di tempat aman — token hanya ditampilkan sekali.

Token ini nanti kamu isi di file `.tfvars` (jangan di-commit ke git).

---

## Dapatkan & Setting SSH Key (untuk data.tf)

Droplet DigitalOcean butuh SSH key supaya kamu bisa login dengan `ssh root@<ip>` tanpa password. Terraform tidak bikin SSH key; dia hanya **memakai key yang sudah ada** di akun DigitalOcean.

### 1. Cek apakah sudah punya SSH key di komputer

```bash
ls -la ~/.ssh
```

Kalau ada `id_rsa.pub` atau `id_ed25519.pub`, kamu sudah punya key. Langkah berikutnya: upload ke DigitalOcean.

### 2. Kalau belum punya, generate dulu

```bash
ssh-keygen -t ed25519 -C "email@kamu.com"
```

Enter saja untuk path default (`~/.ssh/id_ed25519`). Isi passphrase kalau mau, atau kosongkan.

### 3. Upload SSH key ke DigitalOcean

1. Buka [DigitalOcean → Security → SSH Keys](https://cloud.digitalocean.com/account/security).
2. Klik **Add SSH Key**.
3. **Name:** isi nama yang gampang diingat, misalnya **agung** (nama ini nanti dipakai di `data.tf`).
4. **Key:** paste isi public key. Di terminal jalankan:
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```
   Copy seluruh baris (dimulai `ssh-ed25519 ...`) lalu paste ke kolom Key.
5. Klik **Add SSH Key**.

Selesai. Nama yang kamu isi (misalnya `agung`) harus sama persis dengan yang dipakai di `data.tf` (lihat penjelasan file `data.tf` di bawah).

---

## Struktur Project

```
projects/terraform/
├── .tfvars.example   # Contoh variable (di-copy jadi .tfvars)
├── .tfvars            # Nilai asli (do_token, dll) — jangan commit!
├── provider.tf        # Provider DigitalOcean + versi
├── variable.tf        # Definisi variable (do_token)
├── data.tf            # Ambil data yang sudah ada (SSH key)
├── main.tf            # Resource utama (droplet)
├── firewall.tf        # Firewall untuk droplet
└── outputs.tf         # Output (misalnya IP server)
```

---

## Penjelasan Per File

### 1. `provider.tf`

Mendefinisikan **provider** yang dipakai (DigitalOcean) dan **versi**-nya.

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
| `required_providers` | Terraform akan download plugin DigitalOcean versi 2.68.0. |
| `provider "digitalocean"` | Koneksi ke DigitalOcean memakai token. Nilai token diambil dari variable `do_token`. |

Token **tidak** ditulis di sini; diisi lewat variable (dan nanti lewat `.tfvars`).

---

### 2. `variable.tf`

Mendefinisikan **input** dari luar (secret/config).

```hcl
variable "do_token" {}
```

Artinya: Terraform butuh variable `do_token`. Kalau tidak diisi (lewat `.tfvars` atau env `TF_VAR_do_token`), Terraform akan minta input saat `plan`/`apply`. Supaya praktis dan aman, kita isi lewat file `.tfvars` (file itu tidak di-commit).

---

### 3. `data.tf`

Mengambil **data yang sudah ada** di DigitalOcean (bukan bikin resource baru).

```hcl
data "digitalocean_ssh_key" "default" {
  name = "agung"
}
```

| Bagian | Fungsi |
|--------|--------|
| `data "digitalocean_ssh_key"` | Query SSH key yang sudah terdaftar di akun DigitalOcean. |
| `name = "agung"` | Nama SSH key di dashboard DigitalOcean. Harus **sama persis** dengan nama yang kamu isi waktu Add SSH Key. |

Hasilnya dipakai di `main.tf` untuk `ssh_keys = [data.digitalocean_ssh_key.default.id]`, sehingga droplet yang dibuat otomatis memakai SSH key itu dan kamu bisa login `ssh root@<ip>`.

**Kalau nama SSH key kamu beda:** ganti `"agung"` dengan nama key kamu di DigitalOcean.

---

### 4. `main.tf`

Mendefinisikan **resource utama**: droplet (VM) di DigitalOcean.

```hcl
resource "digitalocean_droplet" "web" {
  name   = "web-prod"
  region = "sgp1"
  size   = "s-1vcpu-512mb-10gb"
  image  = "ubuntu-22-04-x64"

  ssh_keys = [data.digitalocean_ssh_key.default.id]
}
```

| Atribut | Arti |
|---------|------|
| `name` | Nama droplet di dashboard. |
| `region` | Datacenter (sgp1 = Singapore). |
| `size` | Spec: 1 vCPU, 512 MB RAM, 10 GB disk. |
| `image` | OS: Ubuntu 22.04 64-bit. |
| `ssh_keys` | ID SSH key dari `data.tf` — droplet bisa di-SSH dengan key itu. |

Resource ini punya *logical name* `web`, sehingga di file lain dirujuk sebagai `digitalocean_droplet.web` (misalnya di `firewall.tf` dan `outputs.tf`).

---

### 5. `firewall.tf`

Mendefinisikan **firewall** yang melekat ke droplet `web`.

```hcl
resource "digitalocean_firewall" "web_fw" {
  name = "web-firewall"

  droplet_ids = [digitalocean_droplet.web.id]

  inbound_rule { ... }  # SSH, HTTP, HTTPS
  outbound_rule { ... } # Allow all outbound
}
```

| Bagian | Fungsi |
|--------|--------|
| `droplet_ids` | Firewall ini hanya berlaku untuk droplet `web` yang didefinisikan di `main.tf`. |
| `inbound_rule` port 22 | SSH dari mana saja (0.0.0.0/0). |
| `inbound_rule` port 80 | HTTP (untuk akses dari browser). |
| `inbound_rule` port 443 | HTTPS. |
| `outbound_rule` | Keluar ke internet (download, update, dll) diizinkan. |

Tanpa firewall, droplet tetap jalan tapi akses dari luar (SSH/HTTP) bisa diblok oleh default policy; dengan file ini aturan terbuka secara eksplisit.

---

### 6. `outputs.tf`

Menampilkan **nilai** setelah `apply` (misalnya IP droplet).

```hcl
output "server_ip" {
  value = digitalocean_droplet.web.ipv4_address
}
```

Setelah `terraform apply` selesai, di terminal akan muncul `server_ip = xxx.xxx.xxx.xxx`. IP itu bisa dipakai untuk SSH atau buka di browser.

---

### 7. `.tfvars.example` dan `.tfvars` (copy jadi .tfvars)

`.tfvars.example` adalah **contoh** isi variable; isi asli (termasuk token) disimpan di `.tfvars` yang **tidak** di-commit.

**Isi `.tfvars.example`:**
```hcl
do_token = "dop_v1_xxx"
```

Langkah yang benar:

1. **Copy** file contoh jadi `.tfvars`:
   ```bash
   cp .tfvars.example .tfvars
   ```
2. **Edit** `.tfvars`:
   - Ganti `dop_v1_xxx` dengan **token asli** kamu dari DigitalOcean.
3. **Jangan commit** `.tfvars` — tambahkan ke `.gitignore`:
   ```
   .tfvars
   *.tfvars
   ```
   (Kecuali tetap mau commit `.tfvars.example` sebagai template.)

Dengan begitu, `terraform plan` dan `terraform apply` bisa memakai `-var-file=.tfvars` dan token tidak perlu diketik di command dan tidak masuk git.

---

## Cara Menjalankan (pakai .tfvars)

Semua perintah dijalankan dari folder project Terraform: `projects/terraform/`.

**1. Copy dan isi variable (sekali saja)**

```bash
cd projects/terraform
cp .tfvars.example .tfvars
# Edit .tfvars, isi do_token dengan token asli kamu
```

**2. Inisialisasi**

```bash
terraform init
```

**3. Cek rencana perubahan**

```bash
terraform plan -var-file=.tfvars
```

Pastikan yang akan dibuat: droplet, firewall. Tidak ada error (misalnya SSH key tidak ketemu).

**4. Terapkan**

```bash
terraform apply -var-file=.tfvars
```

Ketika muncul konfirmasi, ketik `yes`. Tunggu sampai selesai.

**5. Lihat output**

Di akhir akan muncul contoh:

```
Outputs:

server_ip = "xxx.xxx.xxx.xxx"
```

Atau jalankan lagi kapan saja:

```bash
terraform output server_ip
```

---

## Buka di Browser dan Test

1. **Ambil IP server**  
   Dari output: `server_ip = xxx.xxx.xxx.xxx`, atau:
   ```bash
   terraform output server_ip
   ```

2. **Test SSH**  
   ```bash
   ssh root@<server_ip>
   ```
   Ganti `<server_ip>` dengan IP tadi. Kalau SSH key sudah benar, masuk tanpa password.

3. **Buka di browser**  
   - Buka: `http://<server_ip>`  
   - Droplet ini **Ubuntu polos**; belum ada web server. Kemungkinan:
     - **Connection refused** atau timeout — normal, karena belum ada yang listen di port 80.
     - Kalau mau ada halaman: SSH dulu ke droplet, lalu install nginx:
       ```bash
       ssh root@<server_ip>
       apt update && apt install -y nginx
       ```
       Lalu buka lagi `http://<server_ip>` — akan muncul halaman default Nginx.

4. **Hapus resource (opsional)**  
   Kalau mau hapus droplet dan firewall:
   ```bash
   terraform destroy -var-file=.tfvars
   ```
   Ketik `yes` saat diminta.

---

## Ringkasan Alur

| Langkah | Perintah / tindakan |
|--------|----------------------|
| Token | Buat di DigitalOcean → isi di `.tfvars` |
| SSH key | Generate (jika belum) → upload ke DO → sesuaikan nama di `data.tf` |
| Variable | `cp .tfvars.example .tfvars` → isi `do_token` |
| Init | `terraform init` |
| Plan | `terraform plan -var-file=.tfvars` |
| Apply | `terraform apply -var-file=.tfvars` |
| Test | `ssh root@<ip>`, buka `http://<ip>` (install nginx dulu jika mau lihat halaman) |
| Destroy | `terraform destroy -var-file=.tfvars` |

Dengan ini, Part 2 menjelaskan satu per satu file, pakai DigitalOcean, dapat token & SSH key, pakai `.tfvars.example` → `.tfvars`, cara run dengan `.tfvars`, dan cara buka di browser serta test.
