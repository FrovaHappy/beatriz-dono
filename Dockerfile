ARG VERSION="22"
FROM node:${VERSION}-alpine AS base
WORKDIR /app
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}
ARG DISCORD_TOKEN
ENV DISCORD_TOKEN=${DISCORD_TOKEN}
ARG DISCORD_CLIENT
ENV DISCORD_CLIENT=${DISCORD_CLIENT}
ARG DISCORD_OWNER
ENV DISCORD_OWNER=${DISCORD_OWNER}
COPY <<EOF .env
DATABASE_URL=${DATABASE_URL}
DISCORD_TOKEN=${DISCORD_TOKEN}
DISCORD_CLIENT=${DISCORD_CLIENT}
DISCORD_OWNER=${DISCORD_OWNER}
EOF

FROM base AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run generate_db
RUN npm run build

FROM base AS deploy_bot
WORKDIR /app
# COPY FILES
COPY --from=build app/package.json app/.env ./
COPY --from=build app/prisma/ ./prisma/
COPY --from=build app/packages/bot/dist/ packages/bot/dist/
COPY --from=build app/packages/bot/fonts/ packages/bot/fonts/
COPY --from=build app/packages/bot/package.json packages/bot/package.json
COPY --from=build app/packages/libs/dist/ packages/libs/dist/
COPY --from=build app/packages/libs/package.json packages/libs/package.json
# INSTALL DEPENDENCIES
RUN npm install --omit=dev
RUN npm run generate_db
CMD npm run bot:start
