FROM node:12-alpine

WORKDIR /app

# install dependencies
COPY package.json yarn.lock ./

RUN yarn install --pure-lockfile

COPY . .

RUN yarn build

EXPOSE 9090

CMD yarn start