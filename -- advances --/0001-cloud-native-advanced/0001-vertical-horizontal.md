# HPA & VPA — Vertical vs Horizontal Scaling

## Kapan Pakai Apa?

| Type | Use Case | Bottleneck |
|------|----------|------------|
| **HPA** (Horizontal) | Concurrency / traffic | Banyak request, butuh lebih banyak pod |
| **VPA** (Vertical) | Resource per instance | CPU/RAM per instance kurang |

---

## Vertical Scaling

Naikkan resource dalam **1 instance**:

- Tambah CPU
- Tambah RAM

```
2 core  →  4 core
2 GB    →  8 GB
```

---

## Horizontal Scaling

Naikkan **jumlah instance**:

```
1 pod       →  5 pod
1 container →  10 container
```

---

## Diagnosa: Bagaimana Tahu Harus Scale Apa?

Sebelum putuskan HPA atau VPA, cek dulu metriknya.

### Manual (VPS / Bare Metal)

Misalnya punya 1 VPS. Gunakan:

```
top
htop
vmstat
iostat
```

### Docker

```
docker stats
```

### Kubernetes

```
kubectl top pod
kubectl top node
```

Atau pakai **Grafana + Prometheus** untuk monitoring berkelanjutan.

---

## Decision Matrix

| Kondisi | Solusi |
|---------|--------|
| CPU tinggi karena traffic | Horizontal |
| Memory tinggi per instance | Vertical |
| Node penuh tapi usage kecil | Request/limit tuning |
| Latency naik saat RPS naik | Horizontal |
| OOM kill sering | Vertical |
| Aplikasi gak bisa multi instance | Vertical |

---

**← Sebelumnya** [Cloud-Native Advanced — Intro](0000-intro.md)

**Selanjutnya →** *(Coming soon)* Cluster autoscaler
