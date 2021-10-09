FROM node:current-alpine3.11
WORKDIR /app

COPY . ./

COPY package.json .

RUN npm install -g

CMD ["./bin/boot.sh"]