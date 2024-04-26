FROM node:20
USER root

ENV NODE_ENV=development

RUN mkdir -p /app

COPY . /app

RUN cd /app && npm install
RUN cd /app && npm run bot:generate_db
RUN cd /app && npm run bot:build
CMD cd /app && npm run bot:start
