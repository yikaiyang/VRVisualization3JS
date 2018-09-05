/**
 * Gulpfile for task automation
 */

const gulp = require('gulp');
const connect = require('gulp-connect');
//const qunit = require('gulp-qunit');


/**
 * Starts a local webserver
 */
gulp.task('webserver', function(){
    connect.server({
        port: 8888,
        root: 'dist',
        livereload: true
    });
});

/**
 * Starts a local webservre with binding on '0.0.0.0' which allows public access
 */
gulp.task('webserver-public', function(){
    connect.server({
        host: '0.0.0.0',
        port: 8888,
        root: 'dist',
        livereload: true
    });
});

/**
 * Starts QUnit tests in PhantomJS
 */
/* gulp.task('qunit', () => {
    return gulp.src('./test/testrunner.html').pipe(qunit());
}) */

gulp.task('data',function(){
    gulp.src('./src/data/*')
        .pipe(gulp.dest('./dist/data/'))
        .pipe(connect.reload());
})

gulp.task('libs', function(){
    gulp.src('./src/libs/*')
        .pipe(gulp.dest('./dist/libs/'))
        .pipe(connect.reload());
})

gulp.task('images', function(){
    gulp.src('./src/images/*')
        .pipe(gulp.dest('./dist/images/')
    )
});

gulp.task('js', function(){
    gulp.src(['./src/js/**/*.js', '!./src/js/**/*.test.js'])
        .pipe(gulp.dest('./dist/js/'))
        .pipe(connect.reload());
});

gulp.task('html', function(){
    gulp.src('./src/*.html')
        .pipe(gulp.dest('./dist/'))
        .pipe(connect.reload());
})

gulp.task('css', function(){
    gulp.src('./src/styles/*.css')
        .pipe(gulp.dest('./dist/styles/'))
        .pipe(connect.reload());
})

gulp.task('samples', function() {
    gulp.src('./src/_samples/*')
        .pipe(gulp.dest('./dist/samples/'))
        .pipe(connect.reload());
});

/**
 * Monitors and detects changes in file structure and reloads page
 */
gulp.task('watch', function(){
    gulp.watch('./src/*.html',['html']);
    gulp.watch('./src/js/**/*.js', ['js']);
    gulp.watch('./src/libs/*.js', ['libs']);
    gulp.watch('./src/styles/*.css', ['css']);
    gulp.watch('./src/_samples/*.html', ['samples']);
})

/* gulp.task('open', function(){
    gulp.src('./dist/index.html')
        .pipe(open({uri: 'http://localhost'}));
}) */

gulp.task('default', ['html', 'css', 'js', 'libs', 'data', 'webserver', 'watch', 'images', 'samples']);

gulp.task('default-public', ['html', 'css', 'js', 'libs', 'data', 'webserver', 'webserver-public', 'watch', 'images', 'samples']);
