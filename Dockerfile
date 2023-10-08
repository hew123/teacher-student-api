# Jest requires node@^16.10.0
FROM node:16-bullseye-slim

WORKDIR .

COPY package*.json ./

RUN yarn install --production=true

COPY . .

ENV PORT=8080

EXPOSE 8080

CMD ["yarn", "start"]