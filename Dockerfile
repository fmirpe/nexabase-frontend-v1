# Dockerfile para aplicación Vue.js con Vite
FROM node:18-alpine as build-stage

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies para el build)
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación sin chequeo de tipos para evitar problemas de compatibilidad
RUN npm run build:prod

# Etapa de producción con nginx
FROM nginx:alpine as production-stage

# Copiar archivos construidos
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 80
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]