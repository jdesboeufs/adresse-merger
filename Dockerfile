# using an optimized node image
FROM node:16.19.0-alpine

RUN npm install pm2 -g

# optimzing caching for yarn install
WORKDIR /app
COPY package.json yarn.lock .
RUN yarn install

# creating /data and /dist folder to be able to map volumes
RUN mkdir data && mkdir dist

# copying the root folder into the workdir taking into account the .dockerignore file
COPY . .

CMD ["sh", "start.sh"]