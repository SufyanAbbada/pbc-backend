FROM node:22-bookworm-slim AS base

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

FROM base AS development

COPY package.json package-lock.json ./

RUN HUSKY=0 npm ci

COPY prisma ./prisma

RUN npm run prisma:generate

COPY tsconfig.json ./
COPY src ./src

FROM development AS build

RUN npm run build

RUN npm prune --omit=dev \
    && npm cache clean --force

FROM base AS runtime

COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

RUN mkdir -p /app/src/assets \
    && chown -R node:node /app/src/assets

ENV NODE_ENV=production

USER node

EXPOSE 3000

CMD ["node", "dist/index.js"]