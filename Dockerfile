# Install dependencies only when needed
FROM node:12-alpine AS deps

WORKDIR /app

# install dependencies
COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:12-alpine AS builder

WORKDIR /app

COPY . .
COPY --from=deps /app/node_modules ./node_modules

RUN yarn build
RUN yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run app
FROM node:12-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/build ./build
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 9090

CMD yarn start