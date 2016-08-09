#!/bin/bash
docker build -t local/app-octoblu .
docker run --rm --name app-octoblu-local -p 3333:80 local/app-octoblu 

# 'nginx-debug' '-g' 'daemon off;'
