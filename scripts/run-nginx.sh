#!/bin/bash

write_default_config() {
  local backend_uri="$(echo "$BACKEND_URI" | sed -e 's/[\/&]/\\&/g')"
  sed -e "s/BACKEND_URI/$backend_uri/" "/templates/default.conf" > /etc/nginx/conf.d/default.conf
}

copy_config() {
  cp /templates/gzip.conf /etc/nginx/conf.d/gzip.conf
}

start_nginx() {
  nginx -g 'daemon off;'
}

main() {
  if [ -z "$BACKEND_URI" ]; then
    echo 'Missing BACKEND_URI env' 
    exit 1
  fi
  write_default_config && \
    copy_config && \
    start_nginx 
}

main "$@"
