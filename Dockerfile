FROM node:20

RUN apt-get update && apt-get install -y python3 make g++

WORKDIR /usr/src/app

COPY ./.env ./

COPY ./package.json ./
COPY ./package-lock.json ./

RUN npm install

COPY ./src ./src

COPY ./.env ./

COPY eslint.config.js ./

CMD ["npm", "start"]