FROM node:5.1.0
MAINTAINER Octoblu <docker@octoblu.com>

EXPOSE 80

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app/
RUN npm install --production

COPY bower.json /usr/src/app/
RUN ["./node_modules/.bin/bower", "install", "--allow-root"]

COPY . /usr/src/app

CMD ["./node_modules/.bin/gulp", "webserver"]
