FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:docker

FROM nginx:alpine
COPY --from=build /app/dist/dashboard/browser /usr/share/nginx/html
EXPOSE 80
