var gulp = require('gulp'),
	connect = require('gulp-connect'),
	open = require('gulp-open'),
	watch = require('gulp-watch'),
	es6transpiler = require('gulp-es6-transpiler'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass');

gulp.task('watch', function() {
	gulp.watch(['./src/style/*.scss'], ['scss', 'reload']);
	gulp.watch(['./src/**/*'], ['tmp', 'reload']);
});

gulp.task('reload', function() {
	gulp.src('src').pipe(connect.reload());
});

gulp.task('scss', function() {
	gulp.src('./src/style/*.scss')
		.pipe(sass({
			errLogToConsole: true
		}))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./.tmp'));
});

gulp.task('tmp', function() {

	console.log('Transpillig...');
	gulp.src(['src/svg/svg.js', 'src/svg/svg.element.js', 'src/svg/*.js'])
		.pipe(concat('svg.js'))
		.pipe(es6transpiler({
			"environments": ["browser"],
		}))
		.pipe(gulp.dest('.tmp'));

	gulp.src(['src/mvc/mvc.js', 'src/mvc/mvc.observable.js', 'src/mvc/*.js'])
		.pipe(concat('mvc.js'))
		.pipe(es6transpiler({
			"environments": ["browser"],
		}))
		.pipe(gulp.dest('.tmp'));

	gulp.src(['src/scalear/scalear.js', 'src/scalear/*.js'])
		.pipe(concat('scalear.js'))
		.pipe(es6transpiler({
			"globals": {
				"Svg": false,
				"Mvc": false
			},
			"environments": ["browser"],
		}))
		.pipe(gulp.dest('.tmp'));
});

gulp.task('serve', function() {
	connect.server({
		root: ['src', '.tmp'],
		port: 8000,
		livereload: true
	});
	gulp.src('./src/index.html')
		.pipe(open('', {
			url: 'http://localhost:8000',
			src: 'chrome'
		}));
});

gulp.task('default', ['tmp', 'serve', 'watch']);