FROM node:16.15.0-alpine

WORKDIR /app

COPY . .
COPY package*.json .

RUN yarn

EXPOSE 5050

CMD ["yarn", "start"]