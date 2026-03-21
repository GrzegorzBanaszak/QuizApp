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

variable "gemini_api_key" {
  description = "Klucz API Gemini przekazywany do kontenera backendu"
  type        = string
  sensitive   = true
}

variable "gemini_model" {
  description = "Nazwa modelu Gemini używanego do generowania pytań"
  type        = string
  default     = "gemini-2.5-flash"
}
