FROM node:16.14.2 as builder

WORKDIR /usr/src/seoltab

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build && \
    yarn install --production

FROM node:16.14.2-alpine as runner

COPY --from=builder /usr/src/seoltab/node_modules ./node_modules
COPY --from=builder /usr/src/seoltab/package.json ./package.json
COPY --from=builder /usr/src/seoltab/dist ./dist
COPY --from=builder /usr/src/seoltab/schema.graphql .

EXPOSE 3000