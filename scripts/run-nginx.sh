#!/bin/bash

write_config() {
  local backend_uri="$(echo "$BACKEND_URI" | sed -e 's/[\/&]/\\&/g')"
  sed -e "s/BACKEND_URI/$backend_uri/" "/default.conf" > /etc/nginx/conf.d/default.conf
}

start_nginx() {
  nginx -g 'daemon off;'
}

main() {
  if [ -z "$BACKEND_URI" ]; then
    echo 'Missing BACKEND_URI env' 
    exit 1
  fi
  write_config && start_nginx 
}

main "$@"
