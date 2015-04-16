FROM node:0.10.38

MAINTAINER Octoblu <docker@octoblu.com>

EXPOSE 9000
ENV PATH $PATH:/usr/local/bin

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g bower gulp

COPY . /usr/src/app
RUN npm install --production
RUN mkdir -p /usr/src/app/public/lib && bower --allow-root install
RUN gulp || echo " WARNING: Gulp Failed"

CMD [ "npm", "start" ]
