FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/openweathermap

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Add Tini
RUN apk add --no-cache tini
# Tini is now available at /sbin/tini
ENTRYPOINT ["/sbin/tini", "-s", "--"]

# EXPOSE 8080
CMD [ "node", "owm_publisher.js" ]