/**
 * Gulpfile 
 * based on: http://www.holgerkoenemann.de/gulp-basics-ein-einsteiger-tutorial/
 */

var gulp = require('gulp');
var connect = require('gulp-connect');


gulp.task('webserver', function(){
    connect.server({
        port: 8888,
        root: 'dist',
        livereload: true
    });
});

gulp.task('webserver-public', function(){
    connect.server({
        host: '0.0.0.0',
        port: 8888,
        root: 'dist',
        livereload: true
    });
});

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
    gulp.src('./src/scripts/**/*.js')
        .pipe(gulp.dest('./dist/scripts/'))
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

gulp.task('watch', function(){
    gulp.watch('./src/*.html',['html']);
    gulp.watch('./src/scripts/*.js', ['js']);
    gulp.watch('./src/styles/*.css', ['css']);
})

/* gulp.task('open', function(){
    gulp.src('./dist/index.html')
        .pipe(open({uri: 'http://localhost'}));
}) */

gulp.task('default', ['html', 'css', 'js', 'libs', 'data', 'webserver', 'watch', 'images']);

gulp.task('default-public', ['html', 'css', 'js', 'libs', 'data', 'webserver', 'webserver-public', 'watch', 'images']);
