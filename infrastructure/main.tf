# 2. Wspólna sieć dla wszystkich kontenerów
resource "docker_network" "quiz_net" {
  name = "quiz_network"
}

# ==========================================
# OBRAZY DOCKER
# ==========================================
resource "docker_image" "redis" {
  name         = "redis:7-alpine"
  keep_locally = true
}

resource "docker_image" "npm" {
  name         = "jc21/nginx-proxy-manager:latest"
  keep_locally = true
}

resource "docker_image" "pihole" {
  name         = "pihole/pihole:latest"
  keep_locally = true
}

# ==========================================
# KONTENERY INFRASTRUKTURALNE
# ==========================================

# Redis - Baza/Cache dla SignalR
resource "docker_container" "redis" {
  name    = "quiz-redis"
  image   = docker_image.redis.image_id
  restart = "unless-stopped"

  networks_advanced {
    name = docker_network.quiz_net.name
  }
}

# Lokalny DNS (Pi-hole)
resource "docker_container" "dns" {
  name    = "quiz-dns"
  image   = docker_image.pihole.image_id
  restart = "unless-stopped"

  ports {
    internal = 53
    external = 53
    protocol = "tcp"
  }
  ports {
    internal = 53
    external = 53
    protocol = "udp"
  }
  # Panel admina DNS przenosimy na port 8053, aby nie gryzł się z NPM
  ports {
    internal = 80
    external = 8053
  }

  env = [
    "TZ=Europe/Warsaw",
    "FTLCONF_webserver_api_password=${var.pihole_password}"
  ]

  # Bind mounty na hoście, żeby konfiguracja przetrwała nawet terraform destroy.
  volumes {
    host_path      = "/opt/quizapp/pihole/etc-pihole"
    container_path = "/etc/pihole"
  }
  volumes {
    host_path      = "/opt/quizapp/pihole/etc-dnsmasq.d"
    container_path = "/etc/dnsmasq.d"
  }

  networks_advanced {
    name = docker_network.quiz_net.name
  }
}

# Nginx Proxy Manager (NPM) - Reverse Proxy
resource "docker_container" "npm" {
  name    = "quiz-npm"
  image   = docker_image.npm.image_id
  restart = "unless-stopped"

  # Porty dla ruchu HTTP/HTTPS oraz panelu admina (81)
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

  # Bind mounty na hoście, żeby NPM zachował konfigurację po usunięciu kontenera
  # i po terraform destroy.
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
# KONTENERY APLIKACJI (Placeholdery)
# ==========================================
# Zakładamy, że obrazy quiz-backend i quiz-frontend będą 
# budowane i wrzucane na serwer z Twojego Windowsa.

resource "docker_container" "backend" {
  name    = "quiz-backend"
  image   = "quiz-backend:latest" # Nazwa lokalnego obrazu backendu
  restart = "unless-stopped"

  env = [
    "Redis__ConnectionString=quiz-redis:6379"
  ]

  networks_advanced {
    name = docker_network.quiz_net.name
  }
  # Nie wystawiamy portów na zewnątrz - Nginx Proxy Manager zajmie się ruchem!
}

resource "docker_container" "frontend" {
  name    = "quiz-frontend"
  image   = "quiz-frontend:latest" # Nazwa lokalnego obrazu frontendu
  restart = "unless-stopped"

  networks_advanced {
    name = docker_network.quiz_net.name
  }
  # Podobnie jak wyżej - ruch obsłuży NPM
}
