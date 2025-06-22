# Etapa 1: build dos arquivos estáticos
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etapa 2: imagem final, apenas arquivos estáticos + nginx
FROM nginx:alpine

# Remove a configuração default do nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia o build do Vite para a pasta pública do nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia configuração customizada do nginx para SPA
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
