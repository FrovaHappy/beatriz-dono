FROM node:22-alpine AS build
ARG PRIVATE
ARG PORT
ENV PRIVATE=$PRIVATE
ENV PORT=$PORT
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build:libs && npm run build:bot

FROM node:22-alpine AS production
WORKDIR /app
COPY --from=build app/package*.json ./
COPY --from=build app/packages/bot/package*.json ./packages/bot/
COPY --from=build app/packages/bot/dist ./packages/bot/dist
COPY --from=build app/packages/bot/index.js ./packages/bot/
COPY --from=build app/packages/bot/tsconfig.json ./packages/bot/
COPY --from=build app/packages/libs/dist ./packages/libs/dist
RUN npm install --only=production
CMD ["npm", "run", "start:bot"]