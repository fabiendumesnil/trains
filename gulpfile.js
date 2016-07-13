var gulp = require('gulp'),
	gutil = require('gulp-util'),
	compass = require('gulp-compass'),
	connect = require('gulp-connect'),
	concat = require('gulp-concat');

var env,
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

sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir +'*.html'];

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
	gulp.watch('components/sass/*.scss', ['compass']);
	gulp.watch('builds/development/*.html', ['html']);
	gulp.watch('builds/development/images/**/*.*', ['images']);
});
//gulp.task('all', ['coffee','js','compass']); //chaining gulp tasks
gulp.task('default', ['html','compass','images','connect','watch']); //gulp task named 'default' will be executed if you just run the gulp command

gulp.task('connect', function() {
	connect.server({
		root: outputDir,
		livereload: true
	})
});

