#!/bin/bash
set -e

GH_REPO="@github.com/juhyxx/scalear"

FULL_REPO="https://$GH_TOKEN$GH_REPO"

commit=`git rev-parse HEAD`
echo $commit > dist/version

git fetch origin gh-pages:gh-pages
git checkout gh-pages

git config --global push.default matching
git config user.name "travis"
git config user.email "travis"
git remote set-url origin $FULL_REPO

cp -rf dist/* .

git add .
git commit -a -m "deployed $commit"
git push --force --quiet origin gh-pages
