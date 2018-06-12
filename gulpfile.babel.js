var gulp = require("gulp");
var babel = require("gulp-babel");
var eslint = require("gulp-eslint");

import gulp from 'gulp';

var paths = {
  scripts: {
    src: ['lib/**/*.js'],
    dest: 'lib/'
  }
};

function lint() {
    return gulp.src(['./lib/**/*.js','./index.js'])
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error
        .pipe(eslint.failAfterError());
};

function watch() {
  gulp.watch(paths.scripts.src, build);
};

function scripts() {
  return gulp.src(paths.scripts.src)
    .pipe(babel())
    .pipe(gulp.dest(paths.scripts.dest));
};

var build = gulp.series(lint,scripts);

gulp.task('build', build);
gulp.task('lint', lint);
gulp.task('default', gulp.series(build,watch));

exports.build = build;
exports.watch = build;
exports.scripts = scripts;
