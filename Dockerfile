FROM node:20-alpine

WORKDIR /usr/app
COPY package*.json ./
RUN npm ci --production
RUN npm install typescript --save-dev
COPY . .
RUN npm run build
