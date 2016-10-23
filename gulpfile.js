var gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    jade = require('gulp-jade'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglifyjs');

gulp.task('browser-sync', ['styles', 'styles:libs', 'scripts', 'jade','addFonts'], function() {
    browserSync.init({
        server: {
            baseDir: "./docs"
        },
        notify: false
    });

});

gulp.task('styles', function() {
    return gulp.src('sass/*.sass')
        .pipe(sass({
            includePaths: require('node-bourbon').includePaths
        }).on('error', sass.logError))
				.pipe(concat('main.min.css'))
				.pipe(minifycss())
        .pipe(gulp.dest('docs/css'))
        .pipe(browserSync.stream());
});

gulp.task('jade', function() {
    return gulp.src('jade/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('docs'));
});

gulp.task('scripts', function() {
    return gulp.src([
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/bootstrap/dist/js/bootstrap.min.js',
        ])
        .pipe(concat('libs.js'))
        .pipe(gulp.dest('./docs/js/'));
});
gulp.task('styles:libs', function() {
    return gulp.src([
            './node_modules/bootstrap/dist/css/bootstrap.min.css',
            './node_modules/font-awesome/css/font-awesome.min.css',
        ])
        .pipe(concat('libs.css'))
        .pipe(gulp.dest('./docs/css/'));
});
gulp.task('addFonts', function() {
    gulp.src(['./node_modules/font-awesome/fonts/*','./node_modules/bootstrap/fonts/*'])
    .pipe(gulp.dest('./docs/fonts'));
});
gulp.task('watch', function() {
    gulp.watch('sass/*.sass', ['styles']);
    gulp.watch('jade/*.jade', ['jade']);
		gulp.watch('jade/*/*.jade', ['jade']);
    gulp.watch('jade/*/*/*.jade', ['jade']);
    gulp.watch('docs/libs/**/*.js', ['scripts']);
    gulp.watch('docs/js/*.js').on("change", browserSync.reload);
    gulp.watch('docs/*.html').on('change', browserSync.reload);
});

gulp.task('default', ['browser-sync', 'watch']);
