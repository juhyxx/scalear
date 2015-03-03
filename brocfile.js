var concat = require('broccoli-concat'),
	pickFiles = require('broccoli-static-compiler'),
	mergeTrees = require('broccoli-merge-trees'),
	compileSass = require('broccoli-sass'),
	uglifyJavaScript = require('broccoli-uglify-js'),
	del = require('del'),
	writeManifest = require('broccoli-manifest'),
	autoprefixer = require('broccoli-autoprefixer'),
	cleanCSS = require('broccoli-clean-css');

del(['dist/*', 'dist']);

var public = pickFiles('src', {
	srcDir: '',
	files: ['index.html', '*.svg'],
	destDir: ''
});

var scripts = concat('src/', {
	inputFiles: ['**/*.js'],
	outputFile: '/scripts.js'
});
scripts = uglifyJavaScript(scripts);

var css = 'src/style';
css = concat(css, {
	inputFiles: ['**/*.scss'],
	outputFile: '/style.scss'
});
css = compileSass([css], 'style.scss', 'style.css');
css = autoprefixer(css);
css = cleanCSS(css);

module.exports = mergeTrees([public, scripts, css]);