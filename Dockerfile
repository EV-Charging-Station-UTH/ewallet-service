# ======================
# Builder stage
# ======================
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY prisma ./prisma/

COPY . .

RUN npx prisma generate

RUN npx prisma db push

RUN npx prisma generate

RUN npm run build

# ======================
# Production stage
# ======================
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

EXPOSE 8888

CMD ["npm", "run", "start:prod"]
