variable "ssh_user" {
  description = "Nazwa użytkownika SSH na serwerze Ubuntu"
  type        = string
}

variable "ssh_host" {
  description = "Adres IP serwera Ubuntu"
  type        = string
}

variable "pihole_password" {
  description = "Hasło do panelu admina Pi-hole"
  type        = string
  sensitive   = true # Terraform ukryje to hasło w logach konsoli
}
