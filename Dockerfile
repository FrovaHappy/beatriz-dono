FROM node:20-alpine AS build
ARG DATABASE_URL
WORKDIR /app
COPY . .
RUN npm install
RUN npm run bot:generate_db
RUN npm run bot:build

FROM node:20-alpine AS production
ARG DATABASE_URL
WORKDIR /app
COPY package.json /packages/bot/package.json ./
RUN npm install --omit=dev
COPY --from=build ./app/packages/bot/dist .
COPY --from=build ./app/packages/bot/fonts ./fonts
COPY --from=build ./app/packages/bot/prisma ./prisma
RUN npx prisma db push
CMD node index.js
