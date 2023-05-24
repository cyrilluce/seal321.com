FROM node:16
MAINTAINER cyrilluce <cyrilluce@gmail.com>

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./

RUN corepack enable && corepack prepare pnpm@latest-7 --activate
RUN pnpm install --production

# Bundle app source
COPY ts-build/src ./src
COPY www ./www
COPY views ./views
COPY versions.js ./

EXPOSE 8080
CMD [ "node", "src/main.js" ]