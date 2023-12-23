FROM node:14 

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY . .

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
