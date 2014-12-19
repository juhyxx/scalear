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
	jshint = require('gulp-jshint'),
	sourcemaps = require('gulp-sourcemaps'),
	cssmin = require('gulp-cssmin'),
	rename = require("gulp-rename"),
	addsrc = require('gulp-add-src'),
	htmlreplace = require('gulp-html-replace'),
	paths = {
		svg: ['src/svg/svg.js', 'src/svg/svg.element.js', 'src/svg/*.js'],
		mvc: ['src/mvc/mvc.js', 'src/mvc/mvc.observable.js', 'src/mvc/*.js'],
		scalear: ['src/scalear/scalear.js', 'src/scalear/*.js']
	};

gulp.task('watch', function() {
	gulp.watch(['./src/style/*.scss'], ['scss', 'reload']);
	gulp.watch(['./src/**/*'], ['lint', 'tmp', 'reload']);
});

gulp.task('reload', function() {
	gulp.src('src').pipe(connect.reload());
});

gulp.task('lint', function() {
	return gulp.src('./src/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish', {
			verbose: true
		}));
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
	gulp.src(paths.svg)
		.pipe(concat('svg.js'))
		.pipe(gulp.dest('.tmp'));

	gulp.src(paths.mvc)
		.pipe(concat('mvc.js'))
		.pipe(gulp.dest('.tmp'));

	gulp.src(paths.scalear)
		.pipe(concat('scalear.js'))
		.pipe(gulp.dest('.tmp'));
});

gulp.task('serve', function() {
	connect.server({
		root: ['src', '.tmp', 'bower_components'],
		port: 8000,
		livereload: true
	});
	gulp.src('./src/index.html')
		.pipe(open('', {
			url: 'http://localhost:8000',
			src: 'chrome'
		}));
});

gulp.task('dist-html', function() {
	return gulp.src('src/index.html')
		.pipe(htmlreplace({
			'css': 'style.min.css',
			'js': 'script.min.js'
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('dist-js', function() {
	del(['dist/*'], function() {
		return gulp.src([].concat(
				['bower_components/Object.observe.poly/index.js'],
				paths.svg,
				paths.mvc,
				paths.scalear, ['src/*.js']
			))
			.pipe(sourcemaps.init())
			.pipe(concat('script.min.js'))
			.pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(addsrc(['src/*.svg']))
			.pipe(gulp.dest('dist'));
	});
});

gulp.task('clean', function() {
	del(['dist/*']);
});
gulp.task('dist-sass', function() {
	return gulp.src(['./src/style/body.scss', './src/style/*.scss'])
		.pipe(sass({
			errLogToConsole: true
		}))
		.pipe(concat('style.min.css'))
		.pipe(cssmin())
		.pipe(gulp.dest('./dist'));
});

gulp.task('manifest', function() {
	return gulp.src('./src/style/*.scss')
		.pipe(sass({
			errLogToConsole: true
		}))
		.pipe(concat('style.css'))
		.pipe(cssmin())
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('serve-dist', function() {
	connect.server({
		root: ['dist'],
		port: 8000,
		livereload: false
	});
	gulp.src('./src/index.html')
		.pipe(open('', {
			url: 'http://localhost:8000',
			src: 'chrome'
		}));
});

gulp.task('default', ['lint', 'tmp', 'serve', 'watch']);
gulp.task('build', ['clean', 'dist-html', 'dist-js', 'dist-sass', 'manifest']);
gulp.task('test', ['build', 'serve-dist']);