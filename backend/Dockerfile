FROM node:18-alpine

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm ci

COPY backend/tsconfig.json ./
COPY backend/src ./src

RUN npm run build

EXPOSE 5000

CMD ["npm", "start"]
