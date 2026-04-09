variable "ssh_user" {
  description = "SSH user for the Azure VM"
  type        = string
}

variable "ssh_host" {
  description = "Public IP or DNS name of the Azure VM"
  type        = string
}

variable "ssh_port" {
  description = "SSH port for the Azure VM"
  type        = string
  default     = "22"
}

variable "backend_image" {
  description = "Docker image for the backend API"
  type        = string
  default     = "quiz-backend:latest"
}

variable "frontend_image" {
  description = "Docker image for the frontend app"
  type        = string
  default     = "quiz-frontend:latest"
}

variable "postgres_database_name" {
  description = "PostgreSQL database name used by the API"
  type        = string
  default     = "QuizApp"
}

variable "postgres_user" {
  description = "PostgreSQL user used by the API"
  type        = string
  default     = "postgres"
}

variable "postgres_password" {
  description = "Password for the PostgreSQL container"
  type        = string
  sensitive   = true
}

variable "jwt_key" {
  description = "JWT signing key used by the backend"
  type        = string
  sensitive   = true
}

variable "google_client_id" {
  description = "Google OAuth client ID used by the backend"
  type        = string
  sensitive   = true
}

variable "google_client_secret" {
  description = "Google OAuth client secret used by the backend"
  type        = string
  sensitive   = true
}

variable "gemini_api_key" {
  description = "Gemini API key passed to the backend container"
  type        = string
  sensitive   = true
}

variable "gemini_model" {
  description = "Gemini model name used for question generation"
  type        = string
  default     = "gemini-2.5-flash"
}
