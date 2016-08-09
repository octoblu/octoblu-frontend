FROM nginx
MAINTAINER Octoblu <docker@octoblu.com>

COPY package.json .

RUN cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]' > .PKG_VERSION

COPY public/ public/ 
COPY scripts/rewrite-files.sh .
COPY default.conf org-default.conf 

RUN ./rewrite-files.sh "https://s3-us-west-2.amazonaws.com/app-static.octoblu.com/v$(cat .PKG_VERSION)" '/public' '/usr/share/nginx/html'
  
RUN sed -e \
  "s/PKG_VERSION/$(cat .PKG_VERSION)/" \
  org-default.conf > \
  default.conf
RUN cp /default.conf /etc/nginx/conf.d/default.conf

CMD /bin/bash -c "envsubst < ./default.conf > /etc/nginx/conf.d/default.conf2 && nginx -g 'daemon off;'"
