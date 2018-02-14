FROM node:16-alpine as builder

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn --pure-lockfile

COPY . .
RUN yarn build

EXPOSE 8080
CMD [ "npx", "serve", "-l", "8080", "build" ]