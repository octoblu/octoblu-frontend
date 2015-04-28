FROM nginx
MAINTAINER Octoblu <docker@octoblu.com>

RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

COPY default.conf /etc/nginx/conf.d/default.conf
COPY public /usr/share/nginx/html
