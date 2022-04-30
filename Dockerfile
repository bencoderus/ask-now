FROM node:16.9.1-alpine

WORKDIR /app

COPY . .
COPY package*.json .

RUN yarn

EXPOSE 5000

CMD ["yarn", "start"]