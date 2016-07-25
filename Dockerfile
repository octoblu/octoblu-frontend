FROM nginx
MAINTAINER Octoblu <docker@octoblu.com>

ENV NPM_CONFIG_LOGLEVEL error

RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY package.json .
COPY .git .git
RUN cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]' > .VERSION
COPY default.conf default.conf
RUN sed -e "s/GIT_TAG/$(cat .VERSION)/" ./default.conf > /etc/nginx/conf.d/default.conf
COPY download-built-assets.sh .
RUN ./download-built-assets.sh
