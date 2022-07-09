const gulp = require('gulp');
const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const njk = require('gulp-nunjucks-render');
const beautify = require('gulp-beautify');
const webserver = require('gulp-webserver');
const livereload = require('gulp-livereload');

gulp.task('sass', function() {
    return gulp.src('./src/sass/*.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'))
        .pipe(livereload());
});

gulp.task('js', function() {
    return gulp.src(['./src/js/*.js'])
        .pipe(concat('main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'))
        .pipe(livereload());
});

gulp.task('njkRender', function() {
    return gulp.src('./src/pages/*.+(html|njk|nunjucks)')
        .pipe(
            njk({
                path: ['./src/templates'],
            })
        )
        .pipe(beautify.html({ indent_size: 4, preserve_newlines: false }))
        .pipe(gulp.dest('dist'))
});

gulp.task('webserver', function() {
    gulp.src('./')
        .pipe(webserver({
            livereload: true,
            directoryListing: true,
            open: true
        }));
});


gulp.task('watch', function() {
    gulp.watch('./src/sass/*.scss', gulp.series('sass'))
        .on('change', function() {
            console.log('changes on styles detected');
        });
    gulp.watch('./src/js/*.js', gulp.series('js'))
        .on('change', function() {
            console.log('changes on js detected');
        });
    gulp.watch('./src/pages/*.njk', gulp.series('njkRender'))
        .on('change', function() {
            console.log('changes on njk detected');
        });
});



gulp.task('default', gulp.parallel('webserver', 'watch'));