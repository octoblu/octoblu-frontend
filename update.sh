#!/bin/bash
git commit -am 'Running Auto Merge and Update'
git checkout develop
git pull github develop
git checkout feature/analyzer
git merge develop
npm update
npm install skynet
npm install socket.io
bower update --allow-root
./node_modules/.bin/gulp


