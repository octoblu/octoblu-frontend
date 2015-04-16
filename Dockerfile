FROM node:0.10.38

MAINTAINER Octoblu <docker@octoblu.com>

EXPOSE 9000
ENV PATH $PATH:/usr/local/bin

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g bower gulp

COPY package.json /usr/src/app/
RUN npm install --production
COPY bower.json /usr/src/app/
RUN bower --allow-root install
COPY . /usr/src/app
RUN gulp

CMD [ "npm", "start" ]
