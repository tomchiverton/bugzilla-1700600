const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');

const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const browserify = require('browserify')
const ngAnnotate = require('browserify-ngannotate');
const glob = require('globby');
const log = require('fancy-log');
const del = require('del');

const notifier = require('node-notifier');

const paths = {
    scripts: [
        'js/**/*.js','js/*js'
    ],
    output: './dist',
}

gulp.task('clean',function() {  
    return del([paths.output]);
})

gulp.task('javascript-browserify',async function(){
    var files = await glob( paths.scripts );
    // https://blog.angular-university.io/what-every-angular-project-likely-needs-and-a-gulp-build-to-provide-it/
    var b = browserify({
        entries: files,
        debug: true,
        transform: [ngAnnotate]
    });

    return b.bundle()
        .on('error', function(err){
            const neat_name = new RegExp(process.cwd(),'g')
            console.log('☹ ', err.message.replace( neat_name,'...') );
            notifier.notify({
                title: 'Compiler error',
                message: err.message.replace( neat_name,'...') 
            })
            this.emit('end');
        })
        .pipe(source('app.min.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', log.error)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.output));
})

exports.default =  gulp.series('clean',function() {
    gulp.watch(paths.scripts, { ignoreInitial: false }, gulp.series('javascript-browserify' ));
});
