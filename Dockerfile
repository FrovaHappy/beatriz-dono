FROM node:20

USER root

ENV NODE_ENV=development

RUN mkdir -p /app

COPY . /app

COPY package*.json .

RUN cd /app && npm install


COPY . .


CMD cd /app && npm run bot:deploy_docker
