FROM nginx
MAINTAINER Octoblu <docker@octoblu.com>

COPY package.json .

RUN cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]' > .PKG_VERSION

COPY public/index.html /usr/share/nginx/html/public/index.html
COPY default.conf . 

RUN sed -e "s/PKG_VERSION/$(cat .PKG_VERSION)/" default.conf > /etc/nginx/conf.d/default.conf
