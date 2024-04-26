FROM node:20

USER node

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

CMD npm run bot:deploy_docker