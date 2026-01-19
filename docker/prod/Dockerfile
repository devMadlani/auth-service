FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json/ .

RUN npm ci

COPY . .

RUN npm run build


FROM node:18-alpine as production

ENV NODE_ENV=production

WORKDIR /server

COPY package*.json ./

RUN npm ci --ignore-scripts
# --omit=dev

COPY --from=builder /app/dist ./

EXPOSE 5500

CMD [ "node" , "src/server.js" ]



# docker build -t mernstack_test_prod_image -f docker/prod/Dockerfile .