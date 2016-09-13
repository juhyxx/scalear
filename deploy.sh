#!/bin/bash

cd public
gitPush gh-pages
echo "BUILD========== ${TRAVIS_BUILD_NUMBER} ==============="
git init
git config user.name "travis"
git config user.email "travis"
git add .
git commit -m "Travis to ${TRAVIS_BUILD_NUMBER}"
git push --force --quiet "https://${GH_TOKEN}@${GH_REF}" master > /dev/null 2>&1
