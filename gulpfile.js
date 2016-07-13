var gulp = require('gulp'),
	gutil = require('gulp-util'),
//	coffee = require('gulp-coffee'),
	browserify = require('gulp-browserify'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	gulpif = require('gulp-if'),
	uglify = require('gulp-uglify'),
	minifyhtml = require('gulp-minify-html'),
	concat = require('gulp-concat');

var env,
	coffeeSources,
	jsSources,
	sassSources,
	htmlSources,
	outputDir,
	sassStyle;

env = process.env.NODE_ENV || 'development';
if (env==='development') {
	outputDir = 'builds/development/';
	sassStyle ='expanded';
} else {
	outputDir = 'builds/production/';
	sassStyle ='compressed';
}

//coffeeSources = ['components/coffee/tagline.coffee'];
jsSources = [
//	'components/scripts/rclick.js',
	'components/scripts/scrollto.js'
];
sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir +'*.html'];

gulp.task('js', function() {
	gulp.src(jsSources)
		.pipe(concat('script.js'))
		.pipe(browserify())
		.pipe(gulpif(env === 'production', uglify({mangle: true, compress: {sequences: true, dead_code: true, conditionals: true, booleans: true, unused: true, if_return: true, join_vars: true, drop_console: true} })))
		.pipe(gulp.dest(outputDir +'js'))
		.pipe(connect.reload())
});

gulp.task('compass', function() {
	gulp.src(sassSources)
		.pipe(compass({
			sass: 'components/sass',
			image: outputDir +'images',
			style: sassStyle
		})
			.on('error', gutil.log))
		.pipe(gulp.dest(outputDir +'css'))
		.pipe(connect.reload())
});

gulp.task('html', function () {
  	gulp.src('builds/development/*.html')
	.pipe(connect.reload())
});

gulp.task('images', function () {
  	gulp.src('builds/development/images/**/*.*')
		.pipe(connect.reload())
});

gulp.task('watch', function() {
	gulp.watch(jsSources, ['js']);
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch('builds/development/images/**/*.*', ['images']);
});
//gulp.task('all', ['coffee','js','compass']); //chaining gulp tasks
gulp.task('default', ['html','js','compass','images','connect','watch']); //gulp task named 'default' will be executed if you just run the gulp command

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	})
});

