FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install


COPY . .

RUN npx prisma generate

RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app

COPY --from=builder /app/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3003

CMD ["node", "dist/main.js"]
