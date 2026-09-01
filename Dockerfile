FROM node:22-alpine AS build
WORKDIR /app
RUN apk add --no-cache python3
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run check

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=4173
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
EXPOSE 4173
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://127.0.0.1:4173/api/health || exit 1
CMD ["./node_modules/.bin/tsx", "server/index.ts"]
