# Apps

Aplikasi di folder ini dipakai sebagai **contoh untuk tutorial Ansible** — role `app` akan pull image Docker dan menjalankan container.

| App | Image | Dipakai di |
|-----|-------|------------|
| [node-api-app](node-api-app/) | `<docker_username>/node-api-app` | `ansible/examples/roles/app/tasks/main.yml` |
| [node-react-app](node-react-app/) | `<docker_username>/node-react-app` | `ansible/examples/roles/app/tasks/main.yml` |

## Alur

1. Build & push image dari folder masing-masing (lihat README di `node-api-app/` dan `node-react-app/`)
2. Jalankan `ansible-playbook` di `ansible/examples` — role `app` akan pull image dan run container
