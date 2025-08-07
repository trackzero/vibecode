FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
RUN apk add --no-cache wget
COPY . .
EXPOSE 3000
CMD ["npm", "start"]

HEALTHCHECK --interval=30s --timeout=5s CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1
