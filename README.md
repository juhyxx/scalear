#Scalear
[![Build Status](https://travis-ci.org/juhyxx/scalear.svg?branch=master)](https://travis-ci.org/juhyxx/scalear)


##What is it?
It is very simple, guitar (or other string instrument players) learns scales and chords as pictures. So this will make simple displaiyng of scales and chords, and easy print.

Inspired by http://www.all-guitar-chords.com/ and others.

 This is a HTML5 application, built with [Brunch](http://brunch.io).
## Browser support
Current version of Internet Explorer (11) is still problematic, and it is still pain to make app working on it, so pardon me, but I can't promise it.
Older version are even worst.

## Technology
No frameworks, only pure JavaScript and SVG (and Babel.io).



## Getting started
* Install (if you don't have them):
    * [Node.js](http://nodejs.org): `brew install node` on OS X
    * [Brunch](http://brunch.io): `npm install -g brunch`
    * Brunch plugins and app dependencies: `npm install`
* Run:
    * `brunch watch --server` — watches the project with continuous rebuild. This will also launch HTTP server with [pushState](https://developer.mozilla.org/en-US/docs/Web/Guide/API/DOM/Manipulating_the_browser_history).
    * `brunch build --production` — builds minified project for production
* Learn:
    * `public/` dir is fully auto-generated and served by HTTP server.  Write your code in `app/` dir.
    * Place static files you want to be copied from `app/assets/` to `public/`.
    * [Brunch site](http://brunch.io), [Getting started guide](https://github.com/brunch/brunch-guide#readme)
