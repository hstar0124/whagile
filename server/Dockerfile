FROM node:16.15.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

# 소스 파일 카피
COPY . .

EXPOSE 8888

CMD ["node", "app.js"]