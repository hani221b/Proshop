FROM node:20-alpine

RUN apk add --no-cache vim curl

WORKDIR /app

COPY package*.json ./

COPY prisma ./prisma  

RUN npm install

COPY . . 

RUN npm run build

RUN npm install -g nodemon ts-node

EXPOSE 5001

CMD ["sh", "-c", "npx prisma migrate deploy && npm run dev:docker"]

# docker build -t auth-service .

# docker run -d -p 5001:5001 auth-service