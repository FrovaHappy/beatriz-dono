FROM node:20-alpine AS build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run bot:generate_db
RUN npm run bot:build

FROM node:20-alpine AS production
WORKDIR /app
COPY package.json /packages/bot/package.json ./
RUN npm install --omit=dev
COPY --from=build ./app/packages/bot/dist .
COPY --from=build ./app/packages/bot/.env .
COPY --from=build ./app/packages/bot/fonts ./fonts
COPY --from=build ./app/packages/bot/prisma ./prisma
RUN npx prisma db push
RUN cd . && ls -a 
CMD node index.js
