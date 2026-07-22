FROM node:18-alpine AS builder

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/tsconfig.json ./
COPY frontend/public ./public
COPY frontend/src ./src

RUN npm run build

FROM node:18-alpine

RUN npm install -g serve

WORKDIR /app/frontend

COPY --from=builder /app/frontend/build ./build

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
