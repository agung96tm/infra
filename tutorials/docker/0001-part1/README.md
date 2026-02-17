# Tutorial Terraform — Part 1: Pengenalan & Install

Part pertama: apa itu Terraform, analogi, cara install, dan cheatsheet dasar.

---

## Mengenai Terraform

**Terraform** adalah tool **Infrastructure as Code (IaC)** dari HashiCorp. Dipakai untuk:

- **Mendefinisikan infra di file** (VM, network, database, dll) dalam format deklaratif (HCL)
- **Satu perintah** untuk create/update/destroy resource di cloud (AWS, GCP, Azure, DigitalOcean, dll)
- **State** — Terraform ingat resource yang sudah dibuat, jadi bisa update atau hapus dengan aman

| Konsep | Penjelasan |
|--------|------------|
| **Deklaratif** | Kamu tulis *apa yang mau dicapai*, bukan *langkah per langkah*. Terraform yang urus caranya. |
| **Provider** | Plugin untuk tiap cloud (AWS, DigitalOcean, dll). Satu project bisa pakai banyak provider. |
| **State** | File yang nyimpan “peta” resource yang sedang dikelola. Dipakai untuk diff dan update. |

---

## Analogi

Bayangkan kamu mau **bangun rumah**:

| Tanpa Terraform | Dengan Terraform |
|-----------------|------------------|
| Kamu telpon tukang, pesan material, atur listrik, air, satu per satu manual | Kamu tulis **blueprint** (file `.tf`): “1 rumah, 2 lantai, listrik, sumur.” Lalu satu perintah: **terapkan blueprint** |
| Kalau mau ubah, harus ingat apa yang dulu dipasang, takut konflik | Blueprint di-*version* (git). Ubah file → apply lagi → Terraform cuma ubah yang berubah |
| Sulit duplikasi ke “rumah kedua” yang mirip | Copy blueprint, ganti nama/alamat, apply — dapat rumah mirip |

**Jadi:** Terraform = *blueprint + tukang yang baca blueprint dan bikin/ubah/hapus* infra di cloud.

---

## Cara Install

### Ubuntu (Debian-based)

Cara resmi pakai **repository HashiCorp**:

**1. Tambah GPG key HashiCorp**

```bash
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
```

**2. Tambah repo APT**

```bash
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
```

**3. Update & install**

```bash
sudo apt update && sudo apt install -y terraform
```

Selesai. Cek dengan:

```bash
terraform version
```

---

### macOS

*WIP — nanti dilengkapi.*

*(Biasanya: `brew install terraform` atau download binary dari hashicorp.com.)*

---

### Windows

*WIP — nanti dilengkapi.*

*(Biasanya: Chocolatey `choco install terraform` atau download binary dari hashicorp.com.)*

---

## Cek Berhasil Install

Jalankan:

```bash
terraform version
```

Contoh keluaran:

```
Terraform v1.9.x
on linux_amd64
+ provider registry.terraform.io/hashicorp/...
```

Kalau muncul versi seperti di atas, Terraform sudah terpasang dan siap dipakai.

---

## Cheatsheet (Umum Dipakai)

### Perintah dasar

| Perintah | Fungsi |
|----------|--------|
| `terraform init` | Setup project: download provider, backend. Wajib dijalankan sekali (atau setelah ganti provider). |
| `terraform plan` | Lihat *preview* perubahan (tanpa mengubah apa pun). |
| `terraform apply` | Terapkan konfigurasi: create/update resource. |
| `terraform destroy` | Hapus semua resource yang dikelola di project ini. |

### Flag sering dipakai

| Flag | Contoh | Fungsi |
|------|--------|--------|
| `-var-file=` | `-var-file=.tfvars` | Pakai variable dari file (misalnya secret). |
| `-out=` | `-out=plan.out` | Simpan hasil `plan` ke file (untuk apply nanti). |
| `-target=` | `-target=aws_instance.web` | Hanya proses resource tertentu (plan/apply/destroy). |
| `-auto-approve` | `apply -auto-approve` | Apply tanpa konfirmasi (hati-hati, khususnya di prod). |

### Alur kerja standar

```bash
# Pertama kali / setelah clone
terraform init

# Cek dulu apa yang berubah
terraform plan -var-file=.tfvars

# Terapkan (akan minta konfirmasi)
terraform apply -var-file=.tfvars
```

### Variable dari environment

Variable bisa diisi pakai env dengan prefix `TF_VAR_`:

```bash
export TF_VAR_do_token="dop_v1_xxx"
terraform plan
```

### Perintah bantu

| Perintah | Fungsi |
|----------|--------|
| `terraform fmt` | Format file `.tf` biar rapi. |
| `terraform validate` | Cek sintaks konfigurasi. |
| `terraform state list` | Daftar resource di state. |
| `terraform show` | Tampilkan state (atau plan file) dalam bentuk readable. |

---

**Selanjutnya:** Part 2 bisa isi struktur project (provider, variable, main, data) atau langsung praktek bikin resource pertama.
