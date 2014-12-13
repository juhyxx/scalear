var gulp = require('gulp'),
	connect = require('gulp-connect'),
	open = require('gulp-open'),
	watch = require('gulp-watch'),
	es6transpiler = require('gulp-es6-transpiler'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass');

gulp.task('watch', function() {
	gulp.watch(['./src/*'], ['build', 'reload']);
});

gulp.task('reload', function() {
	gulp.src('src').pipe(connect.reload());
});

gulp.task('build', function() {
	gulp.src('./src/*.scss')
		.pipe(sass({
			errLogToConsole: true
		}))
		.pipe(gulp.dest('./dist'));

	console.log('Transpillig...');
	gulp.src(['src/svg/svg.js', 'src/svg/svg.element.js', 'src/svg/*.js'])
		.pipe(concat('svg.js'))
		.pipe(es6transpiler({
			"environments": ["browser"],
		}))
		.pipe(gulp.dest('dist'));

	gulp.src(['src/mvc/mvc.js', 'src/mvc/mvc.observable.js', 'src/mvc/*.js'])
		.pipe(concat('mvc.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('serve', function() {
	connect.server({
		root: ['src', 'dist'],
		port: 8000,
		livereload: true
	});
	gulp.src('./src/index.html')
		.pipe(open('', {
			url: 'http://localhost:8000',
			src: 'chrome'
		}));
});

gulp.task('default', ['build', 'serve', 'watch']);