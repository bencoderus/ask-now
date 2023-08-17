FROM node:16.20.2-alpine

WORKDIR /app

COPY . .
COPY package*.json .

RUN yarn

EXPOSE 5050

CMD ["yarn", "start"]