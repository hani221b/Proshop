FROM node:20-alpine

RUN apk add --no-cache vim curl

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma  

RUN npm install

COPY . . 

RUN npm run build

RUN npm install -g nodemon ts-node

EXPOSE 5002

CMD ["sh", "-c", "npx prisma migrate deploy && nodemon dist/index.js"]

# docker build -t products-service .

# docker run -d -p 5002:5002 products-service