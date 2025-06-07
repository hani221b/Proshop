FROM node:20-alpine

RUN apk add --no-cache vim curl

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma  

RUN npm install

COPY . . 

RUN npm run build

RUN npm install -g nodemon ts-node

EXPOSE 5003

CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev:docker"]

# docker build -t orders-service .

# docker run -d -p 5003:5003 orders-service