FROM node:16.14.2-alpine

WORKDIR /app

COPY . .
COPY package*.json .

RUN yarn global add typescript pm2 && yarn

EXPOSE 5000

CMD ["yarn", "run", "start:prod"]