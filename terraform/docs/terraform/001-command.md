# Terraform — Basic Commands

Referensi perintah dasar Terraform beserta penjelasan singkat.

---

## Perintah Utama

### `terraform init`

Inisialisasi project — download provider, setup backend, siap untuk `plan`/`apply`.

**Kapan dipakai:** Pertama kali buka project, atau setelah menambah/mengganti provider.

```bash
terraform init
```

---

### `terraform plan`

Preview perubahan yang akan terjadi — lihat dulu tanpa mengubah apa pun.

| Flag | Fungsi |
|------|--------|
| `-var-file=.tfvars` | Pakai nilai variable dari file .tfvars |

```bash
terraform plan -var-file=.tfvars
```

---

### `terraform apply`

Eksekusi perubahan — bikin/update/hapus resource sesuai konfigurasi.

```bash
terraform apply -var-file=.tfvars
```

**Tips:** Terraform akan tampilkan preview dulu, ketik `yes` untuk konfirmasi.

---

### `terraform destroy`

Hapus semua resource yang dikelola Terraform di project ini.

```bash
terraform destroy -var-file=.tfvars
```

**Hati-hati:** Akan hapus droplet, volume, dll. Pastikan sudah yakin.

---

## Alur Kerja Umum

**Setup pertama kali:**
```bash
terraform init
terraform plan -var-file=.tfvars   # cek dulu
terraform apply -var-file=.tfvars  # eksekusi
```

**Setelah edit file .tf:**
```bash
terraform plan -var-file=.tfvars   # cek perubahan
terraform apply -var-file=.tfvars  # terapkan
```

---

## Kasus Khusus

### Resource dihapus manual dari dashboard

Terraform masih anggap resource ada, tapi di cloud sudah tidak ada.

**Gejala:** `Error: resource not found`

**Solusi:**
```bash
terraform refresh -var-file=.tfvars   # sinkron state dengan kenyataan
terraform apply -var-file=.tfvars     # perbaiki state
```

---

### Check di CI/Production (tanpa apply otomatis)

Untuk pipeline yang ingin cek dulu, apply nanti manual.

```bash
terraform plan -var-file=.tfvars -out=plan.out   # simpan plan ke file
terraform apply plan.out                          # apply pakai plan yang tadi
```

---

### Hapus satu resource saja

Hapus spesifik resource, bukan semua.

```bash
terraform destroy -target=digitalocean_droplet.web -var-file=.tfvars
```

Ganti `digitalocean_droplet.web` dengan resource yang mau dihapus.

---

## Best Practice

| Praktik | Penjelasan |
|---------|------------|
| **Selalu plan dulu (prod)** | Cek dulu apa yang berubah sebelum apply |
| **Jangan hardcode secret** | Pakai variable + .tfvars / env |
| **Jangan edit lewat dashboard** | Kalau mau ubah, ubah di .tf lalu apply — biar state tetap sinkron |
| **Commit .tf, jangan .tfvars** | .tfvars berisi secret, masuk `.gitignore` |
| **Satu folder = satu state** | Satu project Terraform punya satu state file |
