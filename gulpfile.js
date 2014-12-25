var gulp = require('gulp'),
	connect = require('gulp-connect'),
	open = require('gulp-open'),
	watch = require('gulp-watch'),
	concat = require('gulp-concat'),
	sass = require('gulp-sass'),
	uglify = require('gulp-uglify'),
	manifest = require('gulp-manifest'),
	del = require('del'),
	jshint = require('gulp-jshint'),
	sourcemaps = require('gulp-sourcemaps'),
	cssmin = require('gulp-cssmin'),
	rename = require("gulp-rename"),
	htmlreplace = require('gulp-html-replace'),
	inject = require("gulp-inject"),
	htmlmin = require('gulp-htmlmin'),
	stripCode = require('gulp-strip-code'),
	paths = {
		svg: ['src/svg/svg.js', 'src/svg/svg.element.js', 'src/svg/*.js'],
		mvc: ['src/mvc/mvc.js', 'src/mvc/mvc.observable.js', 'src/mvc/*.js'],
		scalear: ['src/scalear/scalear.js', 'src/scalear/*.js']
	};

gulp.task('watch', function() {
	gulp.watch(['./src/*.html', './src/*.svg'], ['reload']);
	gulp.watch(['./src/style/*.scss'], ['scss', 'reload']);
	gulp.watch(['./src/svg/*'], ['tmp-svg', 'reload']);
	gulp.watch(['./src/mvc/*'], ['tmp-mvc', 'reload']);
	gulp.watch(['./src/scalear/*'], ['tmp-scalear', 'reload']);
});

gulp.task('reload', function() {
	return gulp.src('src').pipe(connect.reload());
});

gulp.task('lint', function() {
	return gulp.src('./src/**/*.js')
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish', {
			verbose: true
		}));
});

gulp.task('scss', function() {
	return gulp.src('./src/style/*.scss')
		.pipe(sass({
			errLogToConsole: true
		}))
		.pipe(concat('style.css'))
		.pipe(gulp.dest('./.tmp'));
});

gulp.task('tmp-svg', function() {
	return gulp.src(paths.svg)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish', {
			verbose: true
		}))
		.pipe(concat('svg.js'))
		.pipe(gulp.dest('.tmp'));
});

gulp.task('tmp-mvc', function() {
	return gulp.src(paths.mvc)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish', {
			verbose: true
		}))
		.pipe(concat('mvc.js'))
		.pipe(gulp.dest('.tmp'));
});

gulp.task('tmp-scalear', function() {
	return gulp.src(paths.scalear)
		.pipe(jshint())
		.pipe(jshint.reporter('jshint-stylish', {
			verbose: true
		}))
		.pipe(concat('scalear.js'))
		.pipe(gulp.dest('.tmp'));
});

gulp.task('serve', function() {
	return connect.server({
		root: ['src', '.tmp', 'bower_components'],
		port: 8000,
		livereload: true
	});

});

gulp.task('open', function() {
	return gulp.src('./src/index.html')
		.pipe(open('', {
			url: 'http://localhost:8000',
			src: 'chrome'
		}));
});

gulp.task('clean', function() {
	return del(['dist/*']);
});

gulp.task('dist-html', function() {
	return gulp.src('src/index.html')
		.pipe(htmlreplace({
			'css': 'style.min.css',
			'js': 'script.min.js'
		}))
		.pipe(inject(gulp.src(['src/google.analytics.js']), {
			starttag: '<!-- inject:analytics -->',
			transform: function(filePath, file) {
				return '<script>' + file.contents.toString('utf8') + '</script>';
			}
		}))
		.pipe(htmlmin({
			collapseWhitespace: true,
			keepClosingSlash: true,
			caseSensitive: true,
			minifyJS: true,
			removeComments: true,
		}))
		.pipe(gulp.dest('dist'));
});

gulp.task('dist-js', function() {
	return gulp.src([].concat(
			[
				'bower_components/Object.observe.poly/index.js',
				'bower_components/customevent-polyfill/customevent-polyfill.js'
			],
			paths.svg,
			paths.mvc,
			paths.scalear, ['src/*.js']
		))
		.pipe(sourcemaps.init())
		.pipe(concat('script.min.js'))
		.pipe(stripCode({
			start_comment: "start-debug-only",
			end_comment: "end-debug-only"
		}))
		.pipe(uglify())
		.pipe(sourcemaps.write('./'))
		.pipe(gulp.dest('dist'));
});

gulp.task('dist-prereq', function() {
	return gulp.src(['src/*.svg'])
		.pipe(gulp.dest('dist'));
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

gulp.task('default', ['lint', 'tmp-svg', 'tmp-mvc', 'tmp-scalear', 'serve', 'watch', 'open']);
gulp.task('build', ['clean', 'dist-html', 'dist-js', 'dist-sass', 'dist-prereq']);
gulp.task('test', ['build', 'serve-dist']);