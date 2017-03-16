FROM octoblu/node:7-staticsite-onbuild

COPY nginx/default.conf /etc/nginx/conf.d/default.conf
