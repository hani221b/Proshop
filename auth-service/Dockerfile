FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . . 

RUN npm run build

RUN npm install -g nodemon ts-node

EXPOSE 5001

CMD ["npx", "nodemon", "--exec", "npx ts-node", "index.ts"]

# docker build -t auth-service .

# docker run -d -p 5001:5001 auth-service