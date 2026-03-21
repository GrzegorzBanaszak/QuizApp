variable "ssh_user" {
  description = "Nazwa uzytkownika SSH na Azure VM"
  type        = string
}

variable "ssh_host" {
  description = "Publiczny adres IP lub DNS Azure VM"
  type        = string
}

variable "ssh_port" {
  description = "Port SSH Azure VM"
  type        = string
  default     = "22"
}

variable "pihole_password" {
  description = "Haslo do panelu admina Pi-hole"
  type        = string
  sensitive   = true
}

variable "gemini_api_key" {
  description = "Klucz API Gemini przekazywany do kontenera backendu"
  type        = string
  sensitive   = true
}

variable "gemini_model" {
  description = "Nazwa modelu Gemini uzywanego do generowania pytan"
  type        = string
  default     = "gemini-2.5-flash"
}
