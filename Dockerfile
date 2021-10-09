FROM node:current-alpine3.11
WORKDIR /app

COPY . ./

COPY package.json .

RUN npm install -g prisma

CMD ["./bin/boot.sh"]