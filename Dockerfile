FROM node:14.4-stretch as builder

# ARG PORT

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json yarn.lock ./

RUN yarn --pure-lockfile

# Bundle app source
COPY . .

RUN yarn build

EXPOSE 8080
CMD [ "npx", "serve", "-l", "8080", "build" ]
