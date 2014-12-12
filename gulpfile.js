var gulp = require('gulp'),
	connect = require('gulp-connect'),
	open = require('gulp-open'),
	watch = require('gulp-watch'),
	es6transpiler = require('gulp-es6-transpiler'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass');

gulp.task('watch', function() {
	gulp.watch(['./app/*'], ['build', 'reload']);
});

gulp.task('reload', function() {
	gulp.src('app').pipe(connect.reload());
});

gulp.task('build', function() {
	gulp.src('./app/*.scss')
		.pipe(sass({
			errLogToConsole: true
		}))
		.pipe(gulp.dest('./dist'));

	console.log('Transpillig...');
	gulp.src(['app/lib/svg.js', 'app/lib/svg.element.js', 'app/lib/*.js'])
		.pipe(concat('svg.js'))
		.pipe(es6transpiler({
			"environments": ["browser"],
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('serve', function() {

	connect.server({
		root: ['app', 'dist'],
		port: 8000,
		livereload: true
	});
	gulp.src('./app/index.html')
		.pipe(open('', {
			url: 'http://localhost:8000',
			app: 'chrome'
		}));
});

gulp.task('default', ['build', 'serve', 'watch']);