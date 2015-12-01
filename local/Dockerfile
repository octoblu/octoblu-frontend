FROM node:5-onbuild
MAINTAINER Octoblu <docker@octoblu.com>

EXPOSE 80

RUN ["./node_modules/.bin/bower", "install", "--allow-root"]
CMD ["./node_modules/.bin/gulp", "webserver"]
