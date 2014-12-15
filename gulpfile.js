var gulp = require('gulp'),
	connect = require('gulp-connect'),
	open = require('gulp-open'),
	watch = require('gulp-watch'),
	es6transpiler = require('gulp-es6-transpiler'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	manifest = require('gulp-manifest'),
	del = require('del'),
	paths = {
		svg: ['src/svg/svg.js', 'src/svg/svg.element.js', 'src/svg/*.js'],
		mvc: ['src/mvc/mvc.js', 'src/mvc/mvc.observable.js', 'src/mvc/*.js'],
		scalear: ['src/scalear/scalear.js', 'src/scalear/*.js']
	};

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
	gulp.src(paths.svg)
		.pipe(concat('svg.js'))
		.pipe(es6transpiler({
			"environments": ["browser"],
		}))
		.pipe(gulp.dest('.tmp'));

	gulp.src(paths.mvc)
		.pipe(concat('mvc.js'))
		.pipe(es6transpiler({
			"environments": ["browser"],
		}))
		.pipe(gulp.dest('.tmp'));

	gulp.src(paths.scalear)
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

gulp.task('dist', function() {
	del(['dist'], function() {
		gulp.src(paths.svg)
			.pipe(concat('svg.js'))
			.pipe(es6transpiler({
				"environments": ["browser"],
			}))
			.pipe(uglify({
				mangle: false
			}))
			.pipe(gulp.dest('dist'));

		gulp.src(paths.mvc)
			.pipe(concat('mvc.js'))
			.pipe(es6transpiler({
				"environments": ["browser"],
			}))
			.pipe(uglify({
				mangle: false
			}))
			.pipe(gulp.dest('dist'));

		gulp.src(paths.scalear)
			.pipe(concat('scalear.js'))
			.pipe(es6transpiler({
				"globals": {
					"Svg": false,
					"Mvc": false
				},
				"environments": ["browser"],
			}))
			.pipe(uglify({
				mangle: false
			}))
			.pipe(gulp.dest('dist'));

		gulp.src(['src/*.*'])
			.pipe(gulp.dest('dist'));

		gulp.src('./src/style/*.scss')
			.pipe(sass({
				errLogToConsole: true
			}))
			.pipe(concat('style.css'))
			.pipe(gulp.dest('./dist'));

		gulp.src(['dist/*'])
			.pipe(manifest({
				hash: true,
				preferOnline: true,
				network: ['http://*', 'https://*', '*'],
				filename: 'app.manifest',
				exclude: 'app.manifest'
			}))
			.pipe(gulp.dest('dist'));
	});

});

gulp.task('default', ['tmp', 'serve', 'watch']);