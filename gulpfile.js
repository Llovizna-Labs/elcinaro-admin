var gulp = require('gulp');
var clean = require('del');
var less = require('gulp-less');
var watch = require('gulp-watch');
var uncss = require('gulp-uncss');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var imagemin = require('gulp-imagemin');
var annotate = require('gulp-ng-annotate')
var minifycss = require('gulp-minify-css');
var pngquant = require('imagemin-pngquant');
var sourcemaps = require('gulp-sourcemaps');
var minifyhtml = require('gulp-minify-html');
var rev = require('gulp-rev');
var collect = require('gulp-rev-collector');
var templateCache = require('gulp-angular-templatecache');

// App Files
var appScripts = [
  'app/*.module.js',
  'app/*.constants.js',
  'app/*.config.js',
  'app/*.run.js',
  'app/*.route.js',
  'app/**/*.js',
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
var appVideos = [];

// Vendor Files
var vendorScripts = [
  'bower_components/jquery/dist/jquery.min.js',
  'bower_components/angular/angular.min.js',
  'bower_components/angular-ui-router/release/angular-ui-router.min.js',
  'bower_components/angular-animate/angular-animate.min.js',
  'bower_components/angular-messages/angular-messages.min.js',
  'bower_components/angular-aria/angular-aria.min.js',
  'bower_components/angular-material/angular-material.min.js',
  'bower_components/lodash/dist/lodash.min.js',
  'bower_components/angular-simple-logger/dist/angular-simple-logger.js',
  'bower_components/markerclustererplus/src/markerclusterer.js',
  'bower_components/angular-google-maps/dist/angular-google-maps.js',
  'bower_components/dropzone/dist/min/dropzone.min.js',
  'bower_components/moment/min/moment.min.js',
  'bower_components/moment/locale/es.js',
  'bower_components/angular-moment/angular-moment.min.js',
  'bower_components/angular-material-data-table/dist/md-data-table.min.js',
  'bower_components/angular-moment-picker/dist/angular-moment-picker.min.js',
  'bower_components/angular-loading-bar/build/loading-bar.min.js',
  'bower_components/pdfmake/build/pdfmake.min.js',
  'bower_components/pdfmake/build/vfs_fonts.js',
  'vendors/offline/offline.min.js',

  // 'bower_components/folder/library.js',

];
var vendorStyles = [
  'bower_components/angular-material/angular-material.min.css',
  'bower_components/dropzone/dist/min/dropzone.min.css',
  'bower_components/angular-material-data-table/dist/md-data-table.min.css',
  'bower_components/angular-moment-picker/dist/angular-moment-picker.min.css',
  'bower_components/angular-loading-bar/build/loading-bar.min.css',
  'vendors/offline/offline-chrome-theme.css',
  'vendors/offline/offline-spanish-indicator.css',
  'vendors/offline/offline-spanish-theme.css',
];
var vendorFonts = [];


// Start the server
gulp.task('server', ['default'], function() {
  connect.server({
    root: "www",
    port: 3000,
    host: '0.0.0.0',
    livereload: false
  });
});

gulp.task('liveserver', ['default'], function() {
  connect.server({
    root: "www",
    port: 3000,
    host: '0.0.0.0',
    livereload: true
  });
});


// Serve the www/ directory without rebuilding
gulp.task('serve', function() {
  connect.server({
    root: "www",
    port: 3000,
    host: '0.0.0.0',
    livereload: false
  });
});


// Clean
gulp.task('clean', function() {
  return clean(['www/scripts', 'www/assets', 'www/*.html']);
});


// Clean
gulp.task('clean-templates', function() {
  return clean(['www/scripts/templates.js']);
});

// Prune
gulp.task('prune', function() {
  return clean(['vendors']);
});


// Scripts
gulp.task('scripts', function() {
  gulp.src(appScripts)
    //.pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    // .pipe(annotate())
    // .pipe(uglify())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('www/scripts'))
});


// JSHint
gulp.task('hint', function() {
  gulp.src(appScripts)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
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
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('www/assets/images/'))
});


// Videos
gulp.task('videos', function() {
  gulp.src(appVideos)
    .pipe(gulp.dest('www/assets/videos/'))
});


// Fonts
gulp.task('fonts', function() {
  gulp.src(appFonts)
    .pipe(gulp.dest('www/assets/fonts/'))
});


// Vendor
gulp.task('vendors', function() {
  gulp.src(vendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('www/scripts'))
  gulp.src(vendorStyles)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest('www/assets/styles'))
  gulp.src(vendorFonts)
    .pipe(gulp.dest('www/assets/fonts'))

});


// Views
gulp.task('views',  [], function() {
  gulp.src('index.html')
    .pipe(minifyhtml())
    .pipe(gulp.dest('www/'));
  gulp.src('assets/views/**/*.html')
    //.pipe(minifyhtml())
    .pipe(gulp.dest('www/assets/views'))
  gulp.src('app/components/**/*.html')
    //.pipe(minifyhtml())
    .pipe(gulp.dest('www/assets/views'))
});


// Optimize
gulp.task('optimize', ['vendors', 'views'], function() {
  gulp.src('www/assets/styles/vendor.css')
    .pipe(uncss({
      html: ['www/index.html', 'www/assets/views/*']
    }))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('www/assets/styles/'));
});


// Default task
gulp.task('default', function() {
  gulp.start('scripts', 'vendors', 'views', 'styles', 'fonts');
});


// Build production site
gulp.task('build', ['default'], function() {
  gulp.start('images', 'videos', 'optimize');
});


// Watch
gulp.task('watch', ['default'], function() {

  // Watch app style, JS and image files
  gulp.watch(appScripts, ['scripts']);
  gulp.watch(appStyles, ['styles']);
  gulp.watch(appImages, ['images']);

  // Watch HTML files
  gulp.watch(['index.html', 'assets/views/**/*.html', 'app/components/**/**.html'], ['views']);

  // Watch any files in www/, reload on change
  watch("www/**").pipe(connect.reload());

});

gulp.task('watchlive', ['liveserver'], function() {

  // Watch app style, JS and image files
  gulp.watch(appScripts, ['scripts']);
  gulp.watch(appStyles, ['styles']);
  gulp.watch(appImages, ['images']);

  // Watch HTML files
  gulp.watch(['index.html', 'assets/views/**/*.html', 'app/components/**/**.html'], ['views']);

  // Watch any files in www/, reload on change
  watch("www/**").pipe(connect.reload());

});

gulp.task('clean:dist', function() {
  return clean(['www/dist']);
});


// Rev
gulp.task('rev', ['default','clean:dist',], function() {
  return gulp.src(['www/assets/styles/*.css', 'www/scripts/*.js'])
    .pipe(rev())
    .pipe(gulp.dest('www/dist/'))
    .pipe(rev.manifest({
      merge: true // merge with the existing manifest (if one exists)
    }))
    .pipe(gulp.dest(process.cwd())); // write manifest to build dir
});

/**
 * Replace all links to assets in files
 * from a manifest file
 */
gulp.task('rev:collect', ['rev'], function() {
  return gulp.src(['rev-manifest.json', 'index.html'])
    .pipe(collect({
      dirReplacements: {
        'assets/styles/': 'dist',
        'scripts/': 'dist',
      }
    }))
    .pipe(gulp.dest('www/'));
});



gulp.task('template-cache', function() {
  return gulp.src(['assets/views/**/*.html'])
    .pipe(templateCache({
      module: 'ElCinaroAdmin',
      transformUrl: function(url) {
        return url.substring(url.lastIndexOf('/') + 1);
      }
    }))
    .pipe(gulp.dest('www/scripts'));
});


// Live task
gulp.task('live', ['liveserver'], function() {
  // Watch app style, JS and image files
  gulp.watch(appScripts, ['scripts']);
  gulp.watch(appStyles, ['styles']);
  gulp.watch(appImages, ['images']);

  // Watch HTML files
  gulp.watch(['index.html', 'assets/views/**/*.html', 'app/components/**/**.html'], ['views', 'template-cache']);

  // Watch any files in www/, reload on change
  //watch("www/**").pipe(connect.reload());
});


//DEPLOYMENT TO S3

var config = {
    accessKeyId: '',
    secretAccessKey: ''
};

var s3 = require('gulp-s3-upload')(config);

gulp.task("upload", ['rev:collect'], function() {
    gulp.src("./www/**")
        .pipe(s3({
            Bucket: 'www.elcinaro.com.ve', //  Required
            ACL:    'public-read'       //  Needs to be user-defined
        }, {
            // S3 Construcor Options, ie:
            maxRetries: 5
        }))
    ;
});
