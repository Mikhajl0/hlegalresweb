const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'));
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const clean = require("gulp-clean");
const autoprefixer = require("autoprefixer");
const postcss = require("gulp-postcss");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const browserSync = require('browser-sync').create();

function css() {
  return gulp
    .src("./src/sass/style.scss")
    .pipe(sass())
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(gulp.dest("./build"));
}

function js() {
  return gulp
    .src("./src/js/**/*.js")
    .pipe(terser())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("./build/js"))
    .pipe(browserSync.stream());
}

function clear() {
  return gulp.src("build", { read: false, allowEmpty: true }).pipe(clean());
}

function watching() {
  gulp.watch("./src/sass/*.scss", css);
  gulp.watch("./src/js/**/*.js", js);
  gulp.watch("./src/*.html", html).on("change", browserSync.reload);
  gulp.watch('./src/assets/**/*', copy).on('change', browserSync.reload);
}

function html() {
  return gulp
    .src("./src/*.html")
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest("./build"));
}

function copy() {
  return gulp.src("./src/assets/**/*", { encoding: false,}).pipe(gulp.dest("./build"))
}

function server() {
  browserSync.init({
    server: {
      baseDir: "./build/"
    },
  });
}

exports.start = gulp.series(
  clear,
  gulp.parallel(css, js, html, copy),
  gulp.parallel(watching, server)
);