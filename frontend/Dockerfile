# Etap 1: Budowanie aplikacji Node.js
FROM node:24-alpine AS build
WORKDIR /app

# Kopiujemy package.json i instalujemy zależności
COPY package*.json ./
RUN npm install

# Kopiujemy resztę plików i budujemy wersję produkcyjną
COPY . .
RUN npm run build

# Etap 2: Serwowanie plików przez Nginx
FROM nginx:alpine AS final
# Kopiujemy zbudowane pliki z folderu dist do Nginxa
COPY --from=build /app/dist /usr/share/nginx/html

# Dodajemy prostą konfigurację Nginxa wspierającą React Router (odświeżanie strony nie wyrzuci błędu 404)
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]