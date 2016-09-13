#!/bin/bash

cd public
echo "BUILD========== ${TRAVIS_BUILD_NUMBER} ==============="
git init
git config user.name "travis"
git config user.email "travis"
git add .
git commit -m "Travis to ${TRAVIS_BUILD_NUMBER}"
git push --force --quiet "https://${GITHUB_API_KEY}@${REPO}" master > /dev/null 2>&1
