FROM nginx
MAINTAINER Octoblu <docker@octoblu.com>

RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY default.conf /etc/nginx/conf.d/default.conf
COPY public /usr/share/nginx/html
