var concat = require('broccoli-concat'),
	pickFiles = require('broccoli-static-compiler'),
	mergeTrees = require('broccoli-merge-trees'),
	compileSass = require('broccoli-sass'),
	uglifyJavaScript = require('broccoli-uglify-js'),
	del = require('del'),
	writeManifest = require('broccoli-manifest');

del(['dist/*', 'dist']);

public = pickFiles('src', {
	srcDir: '',
	files: ['index.html', '*.svg'],
	destDir: ''
});

var scripts = concat('src/', {
	inputFiles: ['**/*.js'],
	outputFile: '/scripts.js'
});

module.exports = mergeTrees([public, scripts]);