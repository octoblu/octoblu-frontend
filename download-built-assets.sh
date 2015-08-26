#!/bin/bash

echo "Waiting for the public.tar.gz"
GIT_COMMIT=$(cat .git/HEAD)
URL="https://s3-us-west-2.amazonaws.com/deploy-octoblu-static/master/${GIT_COMMIT}-public.tar.gz"

x=0
while true; do
  if [ "$x" -eq 30 ]; then
    echo "TIMEOUT"
    exit 1
  fi

  STATUS_CODE=$(curl --silent --head $URL | head -n 1 | cut -d$' ' -f2)

  if [ "$STATUS_CODE" == "200" ]; then
    break
  fi

  echo -n '.'
  x=$((x+1))
  sleep 10
done

curl --silent $URL \
    | tar -xzmC /usr/share/nginx/html && \
    mv /usr/share/nginx/html/public/* /usr/share/nginx/html && \
    rm -rf /usr/share/nginx/html/public
