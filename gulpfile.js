var gulp = require('gulp');
var clear = require('del');
var less = require('gulp-less');
var open = require('gulp-open');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var notify = require('gulp-notify');
var annotate = require('gulp-ng-annotate')
var minifycss = require('gulp-minify-css');
var sourcemaps = require('gulp-sourcemaps');

// App Files
var appScripts = [
  'app/app.js',
  'app/controllers/*.js',
  'app/directives/*.js',
  'app/services/*.js',
  'app/filters/*.js'
];
var appStyles = [
  'assets/styles/*.less'
];
var appImages = [
  'assets/images/**'
];
var appFonts = [
  'assets/fonts/**'
];

// Vendor Files
var vendorScripts = [
  'app/vendors/jquery/dist/jquery.min.js',
  'app/vendors/angular/angular.min.js',
  'app/vendors/angular-sanitize/angular-sanitize.min.js',
  'app/vendors/angular-cookies/angular-cookies.min.js',
  'app/vendors/angular-ui-router/release/angular-ui-router.min.js',
  'app/vendors/lodash/lodash.min.js',
  'app/vendors/bootstrap/dist/js/bootstrap.min.js'
];
var vendorStyles = [
  'app/vendors/bootstrap/dist/css/bootstrap.min.css'
];

// Start the server
gulp.task('server', ['default'], function() {
  connect.server({
    root: "www",
    port: 2000,
    host: '127.0.0.1',
    livereload: true
  });
  gulp.src('./gulpfile.js')
    .pipe(open('', {
      url: 'http://localhost:2000'
    }));
});

// Clean
gulp.task('clean', function(cb) {
  clear(['www/scripts', 'www/assets', 'www/*.html'], cb);
});

// Bower
gulp.task('bower', function() {
  gulp.src('bower_components/**/')
    .pipe(gulp.dest('app/vendors'));
});

// Scripts
gulp.task('scripts', function() {
  gulp.src(appScripts)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(annotate())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('www/scripts'))
});

// Styles
gulp.task('styles', function() {
  gulp.src('assets/styles/app.less')
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(minifycss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('www/assets/styles/'))
});

// Images
gulp.task('images', function() {
  gulp.src(appImages)
    .pipe(gulp.dest('www/assets/images/'))
});

// Fonts
gulp.task('fonts', function() {
  gulp.src(appFonts)
    .pipe(gulp.dest('www/assets/fonts/'))
});

// Vendor
gulp.task('vendors', ['bower'], function() {
  gulp.src(vendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('www/scripts'))
  gulp.src(vendorStyles)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('www/assets/styles'))
});

// Views
gulp.task('views', function() {
  gulp.src('index.html')
    .pipe(gulp.dest('www/'));
  gulp.src('assets/views/**/*.html')
    .pipe(gulp.dest('www/assets/views'))
});

// Default task
gulp.task('default', ['clean'], function() {
  gulp.start('scripts', 'vendors', 'views', 'styles', 'images', 'fonts');
});

// Watch
gulp.task('watch', ['server'], function() {

  // Watch app style and JS files
  gulp.watch(appScripts, ['scripts']);
  gulp.watch(appStyles, ['styles']);

  // Watch HTML files
  gulp.watch(['index.html', 'assets/views/**/*.html'], ['views']);

  // Watch any files in www/, reload on change
  watch("www/**").pipe(connect.reload());

});
