# Etap 1: Budowanie aplikacji Node.js
FROM node:24-alpine AS build
WORKDIR /app

# Vite wstrzykuje VITE_* do bundle podczas builda, wiec backend musi byc znany tutaj.
ARG VITE_BACKEND_URL=https://api.quiz-volt.pl
ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}

# Kopiujemy package.json i instalujemy zaleznosci
COPY package*.json ./
RUN npm install

# Kopiujemy reszte plikow i budujemy wersje produkcyjna
COPY . .
RUN npm run build

# Etap 2: Serwowanie plikow przez Nginx
FROM nginx:alpine AS final
# Kopiujemy zbudowane pliki z folderu dist do Nginxa
COPY --from=build /app/dist /usr/share/nginx/html

# Dodajemy prosta konfiguracje Nginxa wspierajaca React Router (odswiezenie strony nie wyrzuci bledu 404)
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
