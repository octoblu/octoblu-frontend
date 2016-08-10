#!/bin/bash

gulp_build() {
  echo '* running gulp' 
  npm run build
}

build_upload() {
  echo '* building upload folder'
  local tag="$(cat ./package.json | jq --raw-output '.version')"
  rm -rf dpl_assets
  mkdir -p dpl_assets/v$tag
  mkdir -p dpl_assets/lib-assets
  cp -r public/assets/* dpl_assets/v$tag && \
    cp -r public/lib-assets/* dpl_assets/lib-assets
}

push_to_s3() {
  echo '* pushing to s3'
  local tag="$(cat ./package.json | jq --raw-output '.version')"
  aws --profile default s3 sync dpl_assets s3://app-static.octoblu.com 
}

build_docker() {
  echo '* building docker'
  docker build -t local/app-octoblu .
}

run_it() {
  echo '* running it normally'
  docker run --rm -it \
    --name app-octoblu-local \
    -e BACKEND_URI='http://app.octoblu.dev' \
    -p 9997:80 local/app-octoblu $@ 
}

run_it_in_debug() {
  echo '* running in debug mode'
  run_it 'nginx-debug' '-g' 'daemon off;'
}

fatal() {
  echo "ERROR: $1"
  exit 1
}

main() {
  local cmd="$1"

  #gulp_build || fatal 'unable to gulp'
  #build_upload || fatal 'build upload'
  #push_to_s3 || fatal 'unable to push to s3'
  build_docker || fatal 'unable to build docker'

  if [ "$DEBUG_NGINX" == 'true' -o "$cmd" == "-d" -o "$cmd" == '--debug' ]; then
    run_it_in_debug || fatal 'unable to run in debug'
  else
    run_it || fatal 'unable to run'
  fi
}

main "$@"

