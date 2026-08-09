FROM node:22-slim AS build
RUN corepack enable
WORKDIR /app
COPY . .
RUN pnpm install --no-frozen-lockfile --dangerously-allow-all-builds
RUN pnpm --filter @workspace/web run build
RUN pnpm --filter @workspace/api-server run build

FROM node:22-slim
RUN corepack enable
WORKDIR /app
COPY --from=build /app /app
ENV NODE_ENV=production
EXPOSE 10000
CMD ["sh", "-c", "yes | timeout 90 pnpm --filter @workspace/db run push-force; pnpm --filter @workspace/db run fix-constraint; pnpm --filter @workspace/db run seed; pnpm --filter @workspace/api-server run start"]
