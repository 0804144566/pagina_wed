# ---- Fase 1: Construcción (Build Stage) ----
# Usamos una imagen oficial de Node.js como base.
# La versión 'lts' (Long Term Support) es estable y recomendada.
FROM node:lts-alpine as builder

# Establecemos el directorio de trabajo dentro del contenedor.
WORKDIR /app

# Copiamos los archivos de configuración del proyecto.
# El '*' asegura que tanto package.json como package-lock.json se copien.
COPY package*.json ./

# Instalamos las dependencias del proyecto.
# 'npm ci' es similar a 'npm install' pero más rápido y seguro para entornos de producción.
RUN npm ci

# Copiamos el resto de los archivos de la aplicación (server.js, la carpeta public, etc.).
COPY . .


# ---- Fase 2: Producción (Production Stage) ----
# Empezamos desde una nueva imagen base más ligera para la versión final.
FROM node:lts-alpine

WORKDIR /app

# Copiamos solo los archivos necesarios desde la fase de construcción.
# Esto hace que la imagen final sea más pequeña y segura.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/public ./public

# Exponemos el puerto 3000, que es el que usa nuestro servidor Express.
EXPOSE 3000

# El comando que se ejecutará cuando se inicie el contenedor.
# Esto inicia nuestro servidor.
CMD ["node", "server.js"]