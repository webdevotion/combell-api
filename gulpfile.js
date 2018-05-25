var gulp = require("gulp");
var babel = require("gulp-babel");

var paths = {
  scripts: {
    src: ['src/**/*.js','!src/test/**/*.js'],
    dest: 'dist/'
  }
};

function watch() {
  gulp.watch(paths.scripts.src, build);
}

function scripts () {
  return gulp.src(paths.scripts.src)
    .pipe(babel())
    .pipe(gulp.dest(paths.scripts.dest));
};

exports.scripts = scripts;
exports.watch = watch;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(scripts);

/*
 * You can still use `gulp.task` to expose tasks
 */
gulp.task('build', build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', gulp.series(build,watch));

