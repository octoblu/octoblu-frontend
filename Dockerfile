FROM nginx
MAINTAINER Octoblu <docker@octoblu.com>

RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

COPY default.conf /etc/nginx/conf.d/default.conf
RUN curl --silent -L https://s3-us-west-2.amazonaws.com/deploy-octoblu-static/public.tar.gz | tar xz -C /usr/share/nginx/html --strip-components=1
