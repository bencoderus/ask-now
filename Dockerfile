FROM node:16.14.2-alpine

WORKDIR /app

COPY . .
COPY package*.json .

RUN yarn

EXPOSE 5050

CMD ["yarn", "start"]