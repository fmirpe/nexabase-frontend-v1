# ---- Stage 1: Build ----
FROM node:20-alpine AS build

WORKDIR /app

# Copiar dependencias primero (mejor cache)
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

# Copiar todo el código
COPY . .

# Argumentos de build para variables de entorno
ARG VITE_API_URL=https://nexabase-api.captain.nine-level.online

# Establecer variables de entorno para el build
ENV VITE_API_URL=$VITE_API_URL

# Construir la app (solo vite, sin vue-tsc)
RUN npm run build

# ---- Stage 2: NGINX ----
FROM nginx:1.27-alpine

# Instalar envsubst para reemplazar variables de entorno
RUN apk add --no-cache gettext

# Copiar build generado por Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar template de configuración de nginx
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Variables de entorno por defecto
ENV BACKEND_URL=https://nexabase-api.captain.nine-level.online

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
