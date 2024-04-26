FROM node:20

RUN mkdir -p /app

COPY . /app

COPY --chown=node:node package*.json ./

RUN npm install

COPY --chown=node:node . .

CMD ["cd", "/app", "&&", "npm", "run", "bot:deploy_docker"]