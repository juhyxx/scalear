var gulp = require('gulp'),
	connect = require('gulp-connect'),
	open = require('gulp-open'),
	watch = require('gulp-watch');

gulp.task('watch', function() {
	gulp.watch(['./app/*'], [ 'reload']);
});

gulp.task('reload', function() {
	gulp.src('app').pipe(connect.reload());
});

gulp.task('serve', function() {
	connect.server({
		root: 'app',
		port: 8000,
		livereload: true
	});
	gulp.src('./app/index.html')
		.pipe(open('', {
			url: 'http://localhost:8000',
			app: 'chrome'
		}));
});

gulp.task('default', ['serve',  'watch']);