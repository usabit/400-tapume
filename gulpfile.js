var gulp = require('gulp');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var stylus = require('gulp-stylus');
var jeet = require('jeet');
var rupture = require('rupture');
var nib = require('nib');
var prefixer = require('autoprefixer-stylus');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var bower = require('gulp-bower');
var del = require('del');
var sequence = require('run-sequence');

gulp.task('stylus', function() {
    return gulp.src('_assets/css/main.styl')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(stylus({
            use: [nib(), prefixer(), jeet(), rupture()],
            compress: true
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('assets/css'))
    ;
});

gulp.task('imagemin', function() {
    return gulp.src('_assets/img/**/*')
        .pipe(plumber())
        .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
        .pipe(gulp.dest('assets/img/'));
});

gulp.task('clean', function(cb) {
    return del(['assets/', 'bower_components/']);
});

gulp.task('bower', function() {
    // roda bower install no root
    return bower();
});

gulp.task('sequence', function(callback) {
    sequence(
        'bower', 
        ['stylus', 'imagemin'],
        'watch',
        callback
    );
});

gulp.task('watch', function() {
    gulp.watch('_assets/css/**/*.styl', ['stylus']);
    gulp.watch('_assets/img/**/*.{jpg,png,gif}', ['imagemin']);
    gulp.watch('/index.html', ['reload']);
});

gulp.task('reload', function() {
    gulp.src(['assets/**/*', 'index.html'])
        .pipe(connect.reload());
});

gulp.task('default', ['sequence'], function() {
    connect.server({
        livereload: true
    });
});