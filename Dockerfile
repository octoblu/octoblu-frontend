FROM octoblu/node:8-staticsite-onbuild

COPY nginx/run-nginx.sh /usr/local/bin/run-nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
