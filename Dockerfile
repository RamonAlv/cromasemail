FROM node:10.15.3

WORKDIR /urs/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3334

CMD [ "npm", "start"]