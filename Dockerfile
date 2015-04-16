FROM node:0.10.38

MAINTAINER Octoblu <docker@octoblu.com>

EXPOSE 9000
ENV PATH $PATH:/usr/local/bin

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g bower gulp

COPY . /usr/src/app
RUN cd /usr/src/app && npm install --production --silent
RUN cd /usr/src/app && mkdir -p public/lib && bower --allow-root --silent install
RUN cd /usr/src/app && gulp

CMD [ "npm", "start" ]
