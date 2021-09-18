FROM node:14.17.6-alpine

WORKDIR /app

COPY . .
COPY package*.json .

RUN npm i -g typescript pm2 && npm link typescript && yarn 

EXPOSE 5000

CMD ["yarn", "run", "start:prod"]