FROM node:current-alpine3.11
WORKDIR /app

COPY . ./

COPY package.json .

CMD ["./bin/boot.sh"]