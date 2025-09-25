# ---- Stage 1: Build ----
FROM node:20-alpine AS build

WORKDIR /app

# Copiar dependencias primero (mejor cache)
COPY package*.json ./
COPY tsconfig*.json ./

RUN npm install

# Copiar todo el código
COPY . .

# Construir la app (solo vite, sin vue-tsc)
RUN npm run build

# ---- Stage 2: NGINX ----
FROM nginx:1.27-alpine

# Copiar build generado por Vite
COPY --from=build /app/dist /usr/share/nginx/html

# Reemplazar configuración default de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
