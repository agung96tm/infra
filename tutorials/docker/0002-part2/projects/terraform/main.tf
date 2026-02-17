resource "digitalocean_droplet" "web" {
  name   = "web-prod"
  region = "sgp1"
  size   = "s-1vcpu-512mb-10gb"
  image  = "ubuntu-22-04-x64"

  ssh_keys = [data.digitalocean_ssh_key.default.id]
}
