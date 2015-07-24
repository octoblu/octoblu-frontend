FROM nginx
MAINTAINER Octoblu <docker@octoblu.com>

RUN apt-get update && \
    apt-get install -y curl && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

COPY default.conf /etc/nginx/conf.d/default.conf
RUN curl --silent https://s3-us-west-2.amazonaws.com/deploy-octoblu-static/public.tar.gz \
    | tar -xzmC /usr/share/nginx/html && \
    mv /usr/share/nginx/html/public/* /usr/share/nginx/html && \
    rm -rf /usr/share/nginx/html/public
