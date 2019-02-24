'use strict';

const gulp = require('gulp');
const browsersync = require("browser-sync").create();
const sass = require('gulp-sass');
const cp = require("child_process");

//browser sync
function browserSync(done) {
  browsersync.init({
    server: {
      baseDir: "./_site/"
    },
    port: 3000
  });
  done();
}

// BrowserSync Reload
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

//compile scss to css
function css(){
  return gulp
    .src('./src/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./assets/css'))
    .pipe(gulp.dest('./_site/assets/css'))
    .pipe(browsersync.stream());;
}

// Jekyll
function jekyll() {
  return cp.spawn("jekyll", ["build", '--config', '_config_dev.yml'], { stdio: "inherit" });
}

// Watch files
function watchFiles() {
  gulp.watch("./src/scss/**/*", css);
  //gulp.watch("./assets/js/**/*", gulp.series(scriptsLint, scripts));
  gulp.watch(
    [
      "./_includes/**/*",
      "./_layouts/**/*",
      "./assets/**/*",
      "./index.html",
      "./collections/index.html",
      "./products/index.html",
      "./customers/account/index.html",
      "./customers/order/index.html",
      "./customers/login/index.html",
      "./cart/index.html",
      "./search/index.html",
    ],
    gulp.series(jekyll, browserSyncReload)
  );
  //gulp.watch("./assets/img/**/*", images);
}

const build = gulp.parallel(css, jekyll);
const watch = gulp.parallel(watchFiles, browserSync);

exports.css = css;
exports.jekyll = jekyll;
exports.build = build;
exports.watch = watch;
exports.default = build;
