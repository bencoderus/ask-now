FROM node:16.17.1-alpine

WORKDIR /app

COPY . .
COPY package*.json .

RUN yarn

EXPOSE 5050

CMD ["yarn", "start"]