## Multi-stage build for a Vite + React app
## Stage 1: build with Node
FROM node:20-alpine AS builder
WORKDIR /app

# Install build tools and dependencies
COPY package.json package-lock.json* ./
RUN npm install --include=optional && \
    npm install --no-save @rollup/rollup-linux-x64-musl

# Copy source and build
COPY . .
RUN npm run build

## Stage 2: serve with nginx
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
