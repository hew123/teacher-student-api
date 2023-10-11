# Jest requires node@^16.10.0
# First stage: use a parent image to compile JS code
FROM node:16-bullseye-slim AS build

WORKDIR .

COPY package*.json ./

RUN yarn install --production=true

COPY . .

RUN yarn build

# Second stage: run things.
FROM node:16-bullseye-slim

WORKDIR .

COPY package.json ./
# RUN yarn install --production=true

# Copy the dist tree from the first stage.
COPY --from=build ./dist ./dist
COPY --from=build ./node_modules ./node_modules

ENV PORT=8080
# This makes sure DB config host points 
# to 'mysql' instead of 'localhost'
ENV NODE_ENV=docker

EXPOSE 8080

CMD ["yarn", "start-js"]