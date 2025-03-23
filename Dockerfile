FROM node:20-alpine

WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npm run build
