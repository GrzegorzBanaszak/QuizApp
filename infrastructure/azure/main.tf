# Shared Docker network for all containers
resource "docker_network" "quiz_net" {
  name = "quiz_network"
}

locals {
  avatar_assets_source_path = abspath("${path.module}/../../assets/avatars")
  avatar_assets_files       = sort(fileset(local.avatar_assets_source_path, "**"))
  avatar_assets_remote_path = "/home/${var.ssh_user}/quizapp/assets/avatars"
  avatar_assets_hash = sha256(jsonencode([
    for file in local.avatar_assets_files :
    "${file}:${filesha256("${local.avatar_assets_source_path}/${file}")}"
  ]))
}

# Upload avatar assets to the VM before the backend starts.
resource "terraform_data" "avatar_assets_upload" {
  triggers_replace = [
    local.avatar_assets_hash,
    var.ssh_host,
    var.ssh_port,
    var.ssh_user
  ]

  provisioner "local-exec" {
    interpreter = ["PowerShell", "-NoProfile", "-Command"]
    command     = "ssh -p ${var.ssh_port} ${var.ssh_user}@${var.ssh_host} \"rm -rf ${local.avatar_assets_remote_path} && mkdir -p ${local.avatar_assets_remote_path}\""
  }

  provisioner "local-exec" {
    interpreter = ["PowerShell", "-NoProfile", "-Command"]
    command     = "Set-Location '${abspath("${path.module}/../..")}'; scp -P ${var.ssh_port} -r assets/avatars/* ${var.ssh_user}@${var.ssh_host}:${local.avatar_assets_remote_path}/"
  }
}

# ==========================================
# DOCKER IMAGES
# ==========================================
resource "docker_image" "npm" {
  name         = "jc21/nginx-proxy-manager:latest"
  keep_locally = true
}

resource "docker_image" "postgres" {
  name         = "postgres:16-alpine"
  keep_locally = true
}

# ==========================================
# INFRASTRUCTURE CONTAINERS
# ==========================================

# PostgreSQL - persistent database for the API
resource "docker_container" "postgres" {
  name     = "quiz-postgres"
  hostname = "quiz-postgres"
  image    = docker_image.postgres.image_id
  restart  = "unless-stopped"

  env = [
    "POSTGRES_DB=${var.postgres_database_name}",
    "POSTGRES_USER=${var.postgres_user}",
    "POSTGRES_PASSWORD=${var.postgres_password}"
  ]

  volumes {
    host_path      = "/opt/quizapp/postgres/data"
    container_path = "/var/lib/postgresql/data"
  }

  networks_advanced {
    name    = docker_network.quiz_net.name
    aliases = ["quiz-postgres", "postgres"]
  }
}

# Nginx Proxy Manager - reverse proxy for frontend and backend
resource "docker_container" "npm" {
  name    = "quiz-npm"
  image   = docker_image.npm.image_id
  restart = "unless-stopped"

  ports {
    internal = 80
    external = 80
  }
  ports {
    internal = 81
    external = 81
  }
  ports {
    internal = 443
    external = 443
  }

  volumes {
    host_path      = "/opt/quizapp/npm/data"
    container_path = "/data"
  }
  volumes {
    host_path      = "/opt/quizapp/npm/letsencrypt"
    container_path = "/etc/letsencrypt"
  }

  networks_advanced {
    name = docker_network.quiz_net.name
  }
}

# ==========================================
# APPLICATION CONTAINERS
# ==========================================

# Backend API - .NET 9 Web API with SignalR and PostgreSQL
resource "docker_container" "backend" {
  name     = "quiz-backend"
  hostname = "quiz-backend"
  image    = var.backend_image
  restart  = "unless-stopped"

  env = [
    "ASPNETCORE_ENVIRONMENT=Production",
    "ASPNETCORE_FORWARDEDHEADERS_ENABLED=true",
    "ConnectionStrings__DefaultConnection=Host=quiz-postgres;Port=5432;Database=${var.postgres_database_name};Username=${var.postgres_user};Password=${var.postgres_password};Include Error Detail=true",
    "AvatarImages__PhysicalPath=/app/assets/avatars",
    "Jwt__Key=${var.jwt_key}",
    "Jwt__CookieSecure=true",
    "Jwt__CookieSameSite=Lax",
    "Google__ClientId=${var.google_client_id}",
    "Google__ClientSecret=${var.google_client_secret}",
    "Gemini__ApiKey=${var.gemini_api_key}",
    "Gemini__Model=${var.gemini_model}"
  ]

  networks_advanced {
    name    = docker_network.quiz_net.name
    aliases = ["quiz-backend", "backend"]
  }

  volumes {
    host_path      = local.avatar_assets_remote_path
    container_path = "/app/assets/avatars"
  }

  depends_on = [
    docker_container.postgres,
    terraform_data.avatar_assets_upload
  ]
}

# Frontend - Vite app served by Nginx
resource "docker_container" "frontend" {
  name     = "quiz-frontend"
  hostname = "quiz-frontend"
  image    = var.frontend_image
  restart  = "unless-stopped"

  networks_advanced {
    name    = docker_network.quiz_net.name
    aliases = ["quiz-frontend", "frontend"]
  }

  depends_on = [docker_container.backend]
}
