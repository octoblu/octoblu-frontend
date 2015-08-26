FROM nginx
MAINTAINER Octoblu <docker@octoblu.com>

RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY default.conf /etc/nginx/conf.d/default.conf
COPY package.json .
COPY .git/HEAD .git/HEAD
COPY download-built-assets.sh .
RUN ./download-built-assets.sh
