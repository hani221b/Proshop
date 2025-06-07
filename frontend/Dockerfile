FROM node:20-alpine

RUN apk add --no-cache vim curl

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

# THIS COMMAND IS NOT SECURE AND MUST BE REPLACED IN THE A PROD ENV
CMD ["sh", "-c", "DANGEROUSLY_DISABLE_HOST_CHECK=true HOST=0.0.0.0 npm start"] 